classDiagram
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
    }

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
    }

    class Permissions {
        +uuid Id
        +string Name
        +string Description
        +datetime CreatedDate
    }

    class RolePermissions {
        +string RoleId
        +uuid PermissionId
    }

    class UserPermissions {
        +string UserId
        +uuid PermissionId
    }

    class AspNetRoles {
        +string Id
        +string Name
        +string NormalizedName
        +string ConcurrencyStamp
    }

    class AspNetUserRoles {
        +string UserId
        +string RoleId
    }

    %% RELATIONSHIPS
    Absences --> AspNetUsers : "UserId"
    Attendance --> AspNetUsers : "UserId"
    Certifications --> AspNetUsers : "UserId"
    Contracts --> AspNetUsers : "UserId"
    Expenses --> AspNetUsers : "UserId"
    Payrolls --> AspNetUsers : "UserId"

    AspNetUserRoles --> AspNetUsers : "UserId"
    AspNetUserRoles --> AspNetRoles : "RoleId"

    RolePermissions --> AspNetRoles : "RoleId"
    RolePermissions --> Permissions : "PermissionId"

    UserPermissions --> AspNetUsers : "UserId"
    UserPermissions --> Permissions : "PermissionId"

    Categories --> Categories : "ParentCategoryId"

    %% STYLE (AspNet tables in different color)
    class AspNetUsers fill:#d1eaff,stroke:#003366,stroke-width:2px
    class AspNetRoles fill:#d1eaff,stroke:#003366,stroke-width:2px
    class AspNetUserRoles fill:#d1eaff,stroke:#003366,stroke-width:2px
