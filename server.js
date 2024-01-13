const inquirer = require("inquirer");
const mysql = require("mysql2");
const fs = require("fs");
const { connect } = require("http2");
const asciiArt = fs.readFileSync("asciiart.txt", "utf8");
console.log(asciiArt);
console.log();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_db",
});

// List of answers for first prompt
const whereToStart = [
  "View All Roles",
  "View All Employees",
  "View All Departments",
  "Add Role",
  "Add Employee",
  "Add Department",
  "Update Employee Role",
  "Quit",
];

// Starting Prompt, asking what user would like to do
function start() {
  inquirer
    .prompt([
      {
        name: "getting_started",
        type: "list",
        message: "What would you like to do?",
        choices: whereToStart,
      },
    ])
    .then((answer) => {
      console.log(answer.getting_started);
      switch (answer.getting_started) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Quit":
          quitProgram();
          break;

        default:
          break;
      }
    });
}

/// / / / / / / / / Needed Fucntion & Array for adding an Employee / / / / / / / / ///
/// / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / ///

/// Function to see Departments table ///
function viewDepartments() {
  connection.query(`SELECT * FROM departments`, (_err, results) => {
    console.table(results);
    start();
  });
}

/// Function to see Roles table ///
function viewRoles() {
  connection.query(`SELECT * FROM roles`, (_err, results) => {
    console.table(results);
    start();
  });
}

/// Function to see Employees table ///
function viewEmployees() {
  connection.query(`SELECT * FROM employees`, (_err, results) => {
    console.table(results);
    start();
  });
}

/// / / / / / / / / Needed Fucntion & Array for adding an Employee / / / / / / / / ///
/// / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / ///

/// Function to ask for employee name when adding a new employee to the Employee list ///
function newName() {
  return [
    {
      name: "firstName",
      type: "input",
      message: "Enter new employee's first name",
    },
    {
      name: "lastName",
      type: "input",
      message: "Enter new employee's last name",
    },
  ];
}

/// / / / / / / / / Function to add an employee to the list of employees / / / / / / / / ///
async function addEmployee() {
  try {
    const addname = await inquirer.prompt(newName());

    // console.log('Adding employee:', addname);

    connection.query(
      "SELECT roles.id, roles.role_title FROM roles ORDER BY roles.id;",
      async (err, res) => {
        if (err) throw err;

        // console.log('Roles retrieved:', res);

        /// / / / / / / / / Gives list of different roles / / / / / / / / ///
        const { role } = await inquirer.prompt([
          {
            name: "role",
            type: "list",
            choices: () => res.map((res) => res.role_title),
            message: "What is the employee's role?",
          },
        ]);

        // console.log('Selected role:', role);

        /// / / / / / / / / Pulls and applies role_ID to selected role / / / / / / / / ///
        let roleId;
        for (const row of res) {
          if (row.role_title === role) {
            roleId = row.id;
            continue;
          }
        }

        // console.log('Role ID:', roleId);

        /// / / / / / / / / Gives list of Managers (selecting only those with an ID of 'NULL') / / / / / / / / ///
        connection.query(
          "SELECT * FROM employees WHERE manager_id is NULL",
          async (err, res) => {
            if (err) throw err;

            // console.log('Maganers retrieved:', res);

            let managerChoices = res.map(
              (res) => `${res.first_name} ${res.last_name}`
            );
            managerChoices.push("none");
            let { manager } = await inquirer.prompt([
              {
                name: "manager",
                type: "list",
                choices: managerChoices,
                message: "Who is this employee's manager?",
              },
            ]);

            // console.log('Selected manger:', manager);

            /// / / / / / / / / Applies cooresponding manager_ID with the Manager selected above / / / / / / / / ///
            let manager_Id;
            let managerName;
            if (manager === null) {
              manager_Id = "none";
            } else {
              for (const data of res) {
                data.fullName = `${data.first_name} ${data.last_name}`;
                if (data.fullName === manager) {
                  manager_Id = data.id;
                  managerName = data.fullName;
                  continue;
                }
              }
            }

            // console.log('Manager ID:', manager_Id);
            // console.log('Manager Name:', managerName);

            /// / / / / / / / / INSERTS all of the selected and pulled data INTO the "employees" SET / / / / / / / / ///
            connection.query(
              "INSERT INTO employees SET ?",
              {
                first_name: addname.firstName,
                last_name: addname.lastName,
                manager_id: manager_Id,
                role_id: roleId,
              },
              (error, results) => {
                if (error) throw error;
                /// Purposefully have excessive, blank, "console.logs" to have visual spacing in the terminal ///
                console.log();
                console.log(results);
                console.log();
                console.log(
                  "The Employee has been successfully added to the database!"
                );
                console.log();
                start();
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

/// / / / / / / / / Needed Fucntions & Arrays for adding a new Role / / / / / / / / ///
/// / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / ///

/// Fuction to ask when what the new role Name (title) and Salary are, as well as what Department the role will be added to
function addRoleQs() {
  return [
    {
      name: "aRole",
      type: "input",
      message: "Enter name of the new role:",
    },
    {
      name: "nSalary",
      type: "input",
      message: "Enter salary of new role (must be numeric):",
    },
    {
      type: "list",
      name: "aTdepartment",
      message: "Which department does the role belong to?",
      choices: async () => {
        const departmentList = await listOfDepartmentNames();
        return departmentList.map((dept) => dept.department_name);
      },
    },
  ];
}

/// / / / / Function to get list of Departments by Name (department_name), used above for prompt in "addRoleQs" function / / / / ///

async function listOfDepartmentNames() {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT departments.id, departments.department_name FROM departments ORDER BY departments.id;",
      async (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

/// / / / / / / / / Function to add a new role to the Roles table / / / / / / / / ///
function addRoleToDB(role_title, salary, department_id) {
  connection.query(
    "INSERT INTO roles (role_title, salary, department_id) VALUES (?, ?, ?);",
    [role_title, Number(salary), department_id],
    function (err, results) {
      if (err) throw err;
      /// Purposefully have excessive, blank, "console.logs" to have visual spacing in the terminal ///
      console.log();
      console.log(results);
      console.log();
      console.log("This new role has been successfully added to the database!");
      console.log();
      // Assuming start.start() is a valid function
      start();
    }
  );
}

async function addRole() {
  try {
    const response = await inquirer.prompt(addRoleQs());
    const departmentList = await listOfDepartmentNames();

    const selectedDepartment = departmentList.find(
      (dept) => dept.department_name === response.aTdepartment
    );
    if (!selectedDepartment) {
      throw new Error("Selected department not found.");
    }

    addRoleToDB(response.aRole, response.nSalary, selectedDepartment.id);
  } catch (error) {
    console.error("Error adding role:", error);
  }
}

/// / / / / / / / / Needed Fucntions & Arrays for adding a new Department / / / / / / / / ///
/// / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / ///

/// / / / / Fuction to ask when what the new department name is / / / / ///
function addDeptQs() {
  return [
    {
      name: "aDept",
      type: "input",
      message: "Enter name of the new department:",
    },
  ];
}

/// / / / / / / / / Function to add a new department to the Departments table / / / / / / / / ///

function addDeptToDB(department_name) {
  connection.query(
    "INSERT INTO departments (department_name) VALUES (?);",
    [department_name],
    function (err, results) {
      if (err) throw err;
      /// Purposefully have excessive, blank, "console.logs" to have visual spacing in the terminal ///
      console.log();
      console.log(results);
      console.log();
      console.log(
        "This new department has been successfully added to the database!"
      );
      console.log();
      // Assuming start.start() is a valid function
      start();
    }
  );
}

async function addDepartment() {
  try {
    const response = await inquirer.prompt(addDeptQs());

    addDeptToDB(response.aDept);
  } catch (error) {
    console.error("Error adding role:", error);
  }
}

/// / / / / / / / / Needed Fucntions & Arrays for updateing Employee role / / / / / / / / ///
/// / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / ///

async function updateEmployeeRole() {
  try {
    const employeeName = await listOfEmployeeNames();

    // Fetch the list of roles
    connection.query("SELECT * FROM roles", async (err, roles) => {
      if (err) throw err;

      // Prompt user to select a new role
      const { newRole } = await inquirer.prompt([
        {
          name: "newRole",
          type: "list",
          choices: roles.map((role) => role.role_title),
          message: "Select the new role for the employee:",
        },
      ]);

      // Get the ID of the selected role
      const newRoleId = roles.find((role) => role.role_title === newRole).id;

      // Update the employee's role in the database
      connection.query(
        "UPDATE employees SET role_id = ? WHERE CONCAT(first_name, ' ', last_name) = ?",
        [newRoleId, employeeName],
        (error, results) => {
          if (error) throw error;

          // Display success message
          console.log();
          console.log(results);
          console.log();
          console.log("Employee role updated successfully!");
          console.log();

          // Restart the program
          start();
        }
      );
    });
  } catch (error) {
    console.error("Error updating employee role:", error);
  }
}

/// / / / / / / / / Function to give list of employee names, in alphabetical order / / / / / / / / ///

async function listOfEmployeeNames() {
  const employeeChoices = await new Promise((resolve, reject) => {
    connection.query("SELECT * FROM employees", (err, res) => {
      if (err) throw err;
      const employeeNames = res.map(
        (res) => `${res.first_name} ${res.last_name}`
      );
      // Sort the employee names alphabetically
      const sortedEmployeeNames = employeeNames.sort();
      sortedEmployeeNames.push("none");
      resolve(sortedEmployeeNames);
    });
  });

  const { employeeList } = await inquirer.prompt([
    {
      name: "employeeList",
      type: "list",
      choices: employeeChoices,
    },
  ]);

  return employeeList;
}

/// / / / / / / / / Function to quit running the program / / / / / / / / ///
/// / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / ///

function quitProgram() {
  const stopApplication = () => {
    console.log("So long and thanks for all the fish!!");
    process.exit(0);
  };

  // Function to display ASCII art
  const displayAsciiArt = () => {
    // Read ASCII art from a file
    const quitImage = fs.readFileSync("pastalasagna.txt", "utf8");
    console.log(quitImage);
    console.log();
  };

  // Function to stop application and display ASCII art
  const stopAndDisplay = () => {
    displayAsciiArt();
    stopApplication();
  };

  // Use the stopAndDisplay function when you want to stop and display ASCII art
  stopAndDisplay();
}

start();
