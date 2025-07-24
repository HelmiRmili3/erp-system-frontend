
## Absence Endpoints

| Method | Endpoint                            | Description               |
|--------|-------------------------------------|---------------------------|
| GET    | `/api/Absences`                     | List all absences         |
| GET    | `/api/Absences/{id}`                | Get one absence by id     |
| POST   | `/api/Absences`                     | Create a new absence      |
| PUT    | `/api/Absences/{id}`                | Update an existing absence|
| DELETE | `/api/Absences/{id}`                | Delete an absence         |
| GET    | `/api/Absences/me`                  | Get current user’s absences|




| Method | Endpoint                                  | Description                       |
| ------ | ----------------------------------------- | --------------------------------- |
| POST   | `/api/Admin/create-role`                  | Create a new role                 |
| POST   | `/api/Admin/assign-permissions-to-role`   | Grant permissions to a role       |
| POST   | `/api/Admin/assign-roles-to-user`         | Assign role(s) to a user          |
| DELETE | `/api/Admin/remove-permissions-from-role` | Revoke permissions from a role    |
| DELETE | `/api/Admin/role`                         | Delete a role                     |
| GET    | `/api/Admin/permissions`                  | List all permissions              |
| GET    | `/api/Admin/roles`                        | List all roles                    |
| GET    | `/api/Admin/rolesPermissions`             | View roles with their permissions |
| GET    | `/api/Admin/users`                        | List all users (admin view)       |


| Method | Endpoint                | Description                       |
| ------ | ----------------------- | --------------------------------- |
| POST   | `/api/Attendances/mark` | Mark attendance (check-in/out)    |
| DELETE | `/api/Attendances/{id}` | Delete an attendance record       |
| GET    | `/api/Attendances`      | List all attendance records       |
| GET    | `/api/Attendances/me`   | Current user’s attendance history |



| Method | Endpoint                   | Description                      |
| ------ | -------------------------- | -------------------------------- |
| POST   | `/api/Certifications`      | Create a new certification       |
| PUT    | `/api/Certifications`      | Update an existing certification |
| GET    | `/api/Certifications`      | List all certifications          |
| DELETE | `/api/Certifications/{id}` | Delete a certification           |
| GET    | `/api/Certifications/{id}` | Get one certification            |
| GET    | `/api/Certifications/me`   | Current user’s certifications    |


| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| POST   | `/api/Contracts`      | Create a new contract       |
| PUT    | `/api/Contracts`      | Update an existing contract |
| GET    | `/api/Contracts`      | List all contracts          |
| DELETE | `/api/Contracts/{id}` | Delete a contract           |
| GET    | `/api/Contracts/{id}` | Get one contract            |
| GET    | `/api/Contracts/me`   | Current user’s contracts    |


| Method | Endpoint             | Description                |
|--------|----------------------|----------------------------|
| POST   | `/api/Expenses`      | Create a new expense       |
| PUT    | `/api/Expenses`      | Update an existing expense |
| GET    | `/api/Expenses`      | List all expenses          |
| DELETE | `/api/Expenses/{id}` | Delete an expense          |
| GET    | `/api/Expenses/{id}` | Get one expense            |
| GET    | `/api/Expenses/me`   | Current user’s expenses    |



| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/Payrolls`      | Create a new payroll record |
| PUT    | `/api/Payrolls`      | Update an existing payroll  |
| GET    | `/api/Payrolls`      | List all payroll records    |
| DELETE | `/api/Payrolls/{id}` | Delete a payroll record     |
| GET    | `/api/Payrolls/{id}` | Get one payroll record      |
| GET    | `/api/Payrolls/me`   | Current user’s payroll info |



Method,Endpoint,Description
POST,/api/Auth/login,Authenticate a user and return a token
POST,/api/Auth/register,Register a new user account
POST,/api/Auth/refresh,Refresh an access token
POST,/api/Auth/change-password,Change the current user's password
GET,/api/Auth/me,Retrieve the current user's information