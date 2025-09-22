classDiagram
direction TB
    class AspNetUsers {
	    +string Id
        +string FirstName
        +string LastName
        +datetime BirthDate
        +string Address
        +string JobTitle
        +string Department
        +datetime HireDate
        +int ContractType
        +int Status
        +datetime CreatedAt
        +string CreatedBy
        +datetime UpdatedAt
        +string UpdatedBy
        +string SupervisorId
        +string UserName
        +string NormalizedUserName
        +string Email
        +string NormalizedEmail
        +bool EmailConfirmed
        +string PasswordHash
        +string SecurityStamp
        +string ConcurrencyStamp
        +string PhoneNumber
        +bool PhoneNumberConfirmed
        +bool TwoFactorEnabled
        +datetime LockoutEnd
        +bool LockoutEnabled
        +int AccessFailedCount
	    --
	    +assignRole(roleId)
	    +removeRole(roleId)
	    +hasRole(roleName) bool
	    +hasPermission(permissionName) bool
	    +getPermissions() List
    }

    class AspNetRoles {
	    +string Id
        +string Name
        +string NormalizedName
        +string ConcurrencyStamp
	    --
	    +addPermission(permissionId)
	    +removePermission(permissionId)
	    +getPermissions() List
    }

    class Permissions {
	    +uuid Id
        +string Name
        +string Description
        +datetime CreatedDate
	    --
	    +isAssignedToRole(roleId) bool
	    +isAssignedToUser(userId) bool
    }

    class UserPermissions {
	    +string UserId
	    +uuid PermissionId
	    --
	    +assignToUser(userId, permissionId)
	    +removeFromUser(userId, permissionId)
    }

    class RolePermissions {
	    +string RoleId
	    +uuid PermissionId
	    --
	    +assignToRole(roleId, permissionId)
	    +removeFromRole(roleId, permissionId)
    }

    class Absences {
	    +int Id
        +string UserId
        +datetime StartDate
        +datetime EndDate
        +string AbsenceType
        +string StatusType
        +string Reason
        +string ApplicationUserId
        +datetime Created
        +string CreatedBy
        +datetime LastModified
        +string LastModifiedBy
	    --
	    +approve()
	    +reject()
	    +requestAbsence()
    }

    class Attendance {
	    +int Id
        +string UserId
        +date AttendanceDay
        +time CheckIn
        +int CheckInMethod
        +float CheckInLatitude
        +float CheckInLongitude
        +string CheckInDeviceId
        +string CheckInIpAddress
        +bool IsCheckInByAdmin
        +time CheckOut
        +int CheckOutMethod
        +float CheckOutLatitude
        +float CheckOutLongitude
        +string CheckOutDeviceId
        +string CheckOutIpAddress
        +bool IsCheckOutByAdmin
        +string ApplicationUserId
        +datetime Created
        +string CreatedBy
        +datetime LastModified
        +string LastModifiedBy
	    --
	    +recordCheckIn()
	    +recordCheckOut()
	    +isLate() bool
    }

    class Payrolls {
	    +int Id
        +string UserId
        +string Period
        +decimal BaseSalary
        +decimal Bonuses
        +decimal Deductions
        +decimal NetSalary
        +string FileUrl
        +bool IsViewedByEmployee
        +string ApplicationUserId
        +datetime Created
        +string CreatedBy
        +datetime LastModified
        +string LastModifiedBy
	    --
	    +calculateNetSalary() decimal
	    +generatePayslip()
    }

    class Expenses {
	    +int Id
        +string UserId
        +string Description
        +decimal Amount
        +datetime ExpenseDate
        +string Category
        +int Status
        +string ReceiptPath
        +string ApplicationUserId
        +datetime Created
        +string CreatedBy
        +datetime LastModified
        +string LastModifiedBy
	    --
	    +submitExpense()
	    +approveExpense()
	    +rejectExpense()
    }

    class Contracts {
	    +int Id
        +string UserId
        +int ContractType
        +datetime StartDate
        +datetime EndDate
        +string FileUrl
        +int Status
        +string ApplicationUserId
        +datetime Created
        +string CreatedBy
        +datetime LastModified
        +string LastModifiedBy
	    --
	    +signContract()
	    +terminateContract()
	    +renewContract()
    }

    class Certifications {
	    +int Id
        +string UserId
        +string Name
        +string Authority
        +datetime DateObtained
        +string FileUrl
        +string ApplicationUserId
        +datetime Created
        +string CreatedBy
        +datetime LastModified
        +string LastModifiedBy
	    --
	    +uploadCertificate(file)
	    +validateCertificate()
    }

    AspNetUsers --> Absences : "1..*"
    AspNetUsers --> Attendance : "1..*"
    AspNetUsers --> Payrolls : "1..*"
    AspNetUsers --> Expenses : "1..*"
    AspNetUsers --> Contracts : "1..*"
    AspNetUsers --> Certifications : "1..*"
    AspNetUsers --> AspNetRoles : "many-to-many"
    AspNetUsers --> Permissions : "via UserPermissions"
    AspNetRoles --> Permissions : "via RolePermissions"

