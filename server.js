const inquirer = require('inquirer')
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db',
});

// List of answers for first prompt
const whereToStart = ["View All Employees", "View All Departments", "View All Roles", "Update Employee Role", "Add Employee", "Add Role", "Add Department", "Quit"];

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
                    viewDepartments()
                    break;
                case "View All Roles":
                    viewRoles()
                    break;
                case "View All Employees":
                    viewEmployees()
                    break;
                case "Add Employee":
                    addEmployee()
                    break;
                case "Add Role":
                    addRole()
                    break;
                case "Add Department":
                    listOfDepartmentNames()
                    break;
                case "Update Employee Role":
                    listOfManagers()
                    break;
                // case "Quit":
                //     quitProgram()
                //     break;

                default:
                    break;
            }
        });
}

// Function to see list of all departments, organized by "departments.id" & demartment_name
function viewDepartments() {
    connection.query(`SELECT * FROM departments`, (_err, results) => {
        console.table(results)
        start()
    })
}

// Function to see list of all roles, organized by roles.id, salary, department_name, & role_title
function viewRoles() {
    connection.query(`SELECT * FROM roles`, (_err, results) => {
        console.table(results)
        start()
    })
}

// Function to see list of all employees
function viewEmployees() {
    connection.query(`SELECT * FROM employees`, (_err, results) => {
        console.table(results)
        start()
    })
}

// Function to add an employee to the list of employees

async function addEmployee() {
    const addname = await inquirer.prompt(newName());

    connection.query('SELECT roles.id, roles.role_title FROM roles ORDER BY roles.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.role_title),
                message: "What is the employee's role?"
            }
        ]);

        let roleId;
        for (const row of res) {
            if (row.role_title === role) {
                roleId = row.id;
                continue;
            }
        }

        connection.query('SELECT * FROM employees WHERE manager_id is NULL', async (err, res) => {
            if (err) throw err;
            let managerChoices = res.map(res => `${res.first_name} ${res.last_name}`);
            managerChoices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: managerChoices,
                    message: "Who is this employee's manager?"
                }
            ]);

            let manager_Id;
            let managerName;
            if (manager === null) {
                manager_Id = 'none';
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
            connection.query(
                'INSERT INTO employees SET ?',
                {
                    first_name: addname.firstName,
                    last_name: addname.lastName,
                    manager_id: manager_Id,
                    role_id: roleId,
                }
            );
        });
    });
    start()
}

// Function to add a role to the list of roles

function addRoleQs(role_title, salary, department_id) {

    connection.query("INSERT INTO roles (role_title, salary, department_id) VALUES (?, ?, (SELECT id FROM departments WHERE department_name = ?));", [role_title, Number(salary), department_id], function (err, results) {
        console.log(results);
        console.log("This new role has been successfully added to the database!");
        start.start();
    })
}

async function addRole() {
    const newRole = await inquirer.prompt(addRoleQs());

    connection.query('SELECT department_name FROM departments', function (err, results) {
        departmentsArr.length = 0;
        for (const departments in results) {
            if (departmentsArr.indexOf(results[departments].department_name) === -1) {
                departmentsArr.push(results[departments].department_name);
            }
        }
    })
    inquirer.prompt(addRoleQs)
        .then((response) => {
            addRoleQs(response.aRole, response.nsalary, response.aTdepartment);
        });


    // // Final connection to make add.Role Function work! //    
    // connection.query(
        'INSERT INTO roles SET ?',
        {
            role_title: newRole.aRole,
            salary: newRole.nsalary,
            department_id: //manager_Id,
            role_id: roleId,
        }
    );



}




// Function to add a new department to the list of all departments

// function addDepartment() {
//     connection.query(`select * from employees`, (err, results) => {
//         console.table(results)
//         start()
//     })
// }


// Function to update an Employee's role to the list of roles

// function updateEmployeeRole() {
//     connection.query(`select * from employees`, (err, results) => {
//         console.table(results)
//         start()
//     })
// }


// Function to quit running the program

// function quitProgram() {
//     connection.query(`select * from employees`, (err, results) => {
//         console.table(results)
//         start()
//     })
// }



//////////////////////// Question Arrays ////////////////////////

// Function to ask for employee name when adding a new employee to the Employee list

function newName() {
    return ([
        {
            name: "firstName",
            type: "input",
            message: "Enter new employee's first name"
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter new employee's last name"
        }
    ]);
}

// Fuction to ask when adding a new role to the Roles list

function addRoleQs() {
    return ([
        {
            name: "aRole",
            type: "input",
            message: "Enter name of the new role"
        },
        {
            name: "nSalary",
            type: "input",
            message: "Enter salary of new role (must be numeric)",
        },
        {
            type: 'list',
            name: 'aTdepartment',
            message: 'Which department does the role belong to?',
            choices: listOfDepartmentNames
        }
    ]);
}


////////////  Functions to show lists from seeds.sql  ////////////

//Function to get list of Departments by Name (department_name)

function listOfDepartmentNames() {
    connection.query('SELECT departments.department_name FROM departments ORDER BY departments.id;', async (err, res) => {
        if (err) throw err;
        const { deptNameList } = await inquirer.prompt([
            {
                name: 'deptNameList',
                type: 'list',
                choices: () => res.map(res => res.department_name)
            }
        ]);
    });
}

// Function to pull departments.id based on Department selected from 'listOfDepartmentNames' function

function pullDepartment_id () {
    connection.query('SELECT departments.id FROM departments', async (err, res) => {
        if (err) throw err;
        let deptIdPull = res.map(res => '${res.departments.id}');
        deptIdPull.push('none');
        let
    })
}



// Function to get list of Roles by Name (role_title)
// THIS IS GOOD TO GO!!! 

function listOfRoleTitles() {
    connection.query('SELECT role_title FROM roles ORDER BY roles.id;', async (err, res) => {
        if (err) throw err;
        const { roleTitleList } = await inquirer.prompt([
            {
                name: 'roleTitleList',
                type: 'list',
                choices: () => res.map(res => res.role_title)
            }
        ]);
    });
}

//Function to get list of Departments by Name (department_name)
// THIS IS GOOD TO GO!!! 

function listOfManagers() {
    connection.query('SELECT * FROM employees WHERE manager_id is NULL', async (err, res) => {
        if (err) throw err;
        let managerChoices = res.map(res => `${res.first_name} ${res.last_name}`);
        managerChoices.push('none');
        const { managerList } = await inquirer.prompt([
            {
                name: 'managerList',
                type: 'list',
                choices: managerChoices,
            }
        ]);
    });
}






// }


// function listDepartmentNames() {

// }


// function listEmployeeFullName() {

// }


// function listManagers() {

// }


// function listDepartmentNames() {

// }


// function listDepartmentNames() {

// }




start()