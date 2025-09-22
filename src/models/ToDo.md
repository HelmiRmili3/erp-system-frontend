CREATE TABLE "public"."Absences"(
   "Id" integer NOT NULL,
   "UserId" character varying(100) NOT NULL,
   "StartDate" timestamp with time zone NOT NULL,
   "EndDate" timestamp with time zone NOT NULL,
   "AbsenceType" character varying(50) NOT NULL,
   "StatusType" character varying(20) NOT NULL,
   "Reason" character varying(500),
   "ApplicationUserId" text,
   "Created" timestamp with time zone NOT NULL,
   "CreatedBy" text,
   "LastModified" timestamp with time zone NOT NULL,
   "LastModifiedBy" text,
   CONSTRAINT "PK_Absences" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Absences_ApplicationUserId" ON "public"."Absences" ("ApplicationUserId");
CREATE INDEX "IX_Absences_UserId" ON "public"."Absences" ("UserId");




CREATE TABLE "public"."AspNetUsers"(
   "Id" text NOT NULL,
   "FirstName" text NOT NULL,
   "LastName" text NOT NULL,
   "BirthDate" timestamp with time zone,
   "Address" text,
   "JobTitle" text NOT NULL,
   "Department" text NOT NULL,
   "HireDate" timestamp with time zone,
   "ContractType" integer,
   "Status" integer NOT NULL,
   "CreatedAt" timestamp with time zone NOT NULL,
   "CreatedBy" text,
   "UpdatedAt" timestamp with time zone NOT NULL,
   "UpdatedBy" text,
   "SupervisorId" text,
   "UserName" character varying(256),
   "NormalizedUserName" character varying(256),
   "Email" character varying(256),
   "NormalizedEmail" character varying(256),
   "EmailConfirmed" boolean NOT NULL,
   "PasswordHash" text,
   "SecurityStamp" text,
   "ConcurrencyStamp" text,
   "PhoneNumber" text,
   "PhoneNumberConfirmed" boolean NOT NULL,
   "TwoFactorEnabled" boolean NOT NULL,
   "LockoutEnd" timestamp with time zone,
   "LockoutEnabled" boolean NOT NULL,
   "AccessFailedCount" integer NOT NULL,
   CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id")
);

CREATE INDEX "EmailIndex" ON "public"."AspNetUsers" ("NormalizedEmail");
CREATE INDEX "IX_AspNetUsers_SupervisorId" ON "public"."AspNetUsers" ("SupervisorId");
CREATE UNIQUE INDEX "UserNameIndex" ON "public"."AspNetUsers" ("NormalizedUserName");



CREATE TABLE "public"."Attendance"(
   "Id" integer NOT NULL,
   "UserId" text NOT NULL,
   "AttendanceDay" date NOT NULL,
   "CheckIn" time without time zone,
   "CheckInMethod" integer,
   "CheckInLatitude" double precision,
   "CheckInLongitude" double precision,
   "CheckInDeviceId" character varying(100),
   "CheckInIpAddress" character varying(45),
   "IsCheckInByAdmin" boolean DEFAULT false NOT NULL,
   "CheckOut" time without time zone,
   "CheckOutMethod" integer,
   "CheckOutLatitude" double precision,
   "CheckOutLongitude" double precision,
   "CheckOutDeviceId" character varying(100),
   "CheckOutIpAddress" character varying(45),
   "IsCheckOutByAdmin" boolean DEFAULT false NOT NULL,
   "ApplicationUserId" text,
   "Created" timestamp with time zone NOT NULL,
   "CreatedBy" text,
   "LastModified" timestamp with time zone NOT NULL,
   "LastModifiedBy" text,
   CONSTRAINT "PK_Attendance" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Attendance_ApplicationUserId" ON "public"."Attendance" ("ApplicationUserId");
CREATE INDEX "IX_Attendance_UserId" ON "public"."Attendance" ("UserId");





CREATE TABLE "public"."Categories"(
   "Id" integer NOT NULL,
   "Logo" text,
   "Name" character varying(100) NOT NULL,
   "ParentCategoryId" integer,
   "Created" timestamp with time zone NOT NULL,
   "CreatedBy" text,
   "LastModified" timestamp with time zone NOT NULL,
   "LastModifiedBy" text,
   CONSTRAINT "PK_Categories" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Categories_ParentCategoryId" ON "public"."Categories" ("ParentCategoryId");


CREATE TABLE "public"."Certifications"(
   "Id" integer NOT NULL,
   "UserId" character varying(100) NOT NULL,
   "Name" character varying(100) NOT NULL,
   "Authority" character varying(100) NOT NULL,
   "DateObtained" timestamp with time zone NOT NULL,
   "FileUrl" character varying(255) NOT NULL,
   "ApplicationUserId" text,
   "Created" timestamp with time zone NOT NULL,
   "CreatedBy" text,
   "LastModified" timestamp with time zone NOT NULL,
   "LastModifiedBy" text,
   CONSTRAINT "PK_Certifications" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Certifications_ApplicationUserId" ON "public"."Certifications" ("ApplicationUserId");
CREATE INDEX "IX_Certifications_UserId" ON "public"."Certifications" ("UserId");





CREATE TABLE "public"."Contracts"(
   "Id" integer NOT NULL,
   "UserId" character varying(100) NOT NULL,
   "ContractType" integer NOT NULL,
   "StartDate" timestamp with time zone NOT NULL,
   "EndDate" timestamp with time zone,
   "FileUrl" character varying(255),
   "Status" integer DEFAULT 0 NOT NULL,
   "ApplicationUserId" text,
   "Created" timestamp with time zone NOT NULL,
   "CreatedBy" text,
   "LastModified" timestamp with time zone NOT NULL,
   "LastModifiedBy" text,
   CONSTRAINT "PK_Contracts" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Contracts_ApplicationUserId" ON "public"."Contracts" ("ApplicationUserId");
CREATE INDEX "IX_Contracts_UserId" ON "public"."Contracts" ("UserId");






CREATE TABLE "public"."Expenses"(
   "Id" integer NOT NULL,
   "UserId" character varying(100) NOT NULL,
   "Description" character varying(500) NOT NULL,
   "Amount" numeric NOT NULL,
   "ExpenseDate" timestamp with time zone NOT NULL,
   "Category" character varying(100) NOT NULL,
   "Status" integer DEFAULT 0 NOT NULL,
   "ReceiptPath" character varying(255) NOT NULL,
   "ApplicationUserId" text,
   "Created" timestamp with time zone NOT NULL,
   "CreatedBy" text,
   "LastModified" timestamp with time zone NOT NULL,
   "LastModifiedBy" text,
   CONSTRAINT "PK_Expenses" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Expenses_ApplicationUserId" ON "public"."Expenses" ("ApplicationUserId");
CREATE INDEX "IX_Expenses_UserId" ON "public"."Expenses" ("UserId");






CREATE TABLE "public"."Payrolls"(
   "Id" integer NOT NULL,
   "UserId" character varying(100) NOT NULL,
   "Period" character varying(50) NOT NULL,
   "BaseSalary" numeric NOT NULL,
   "Bonuses" numeric NOT NULL,
   "Deductions" numeric NOT NULL,
   "NetSalary" numeric NOT NULL,
   "FileUrl" character varying(255),
   "IsViewedByEmployee" boolean DEFAULT false NOT NULL,
   "ApplicationUserId" text,
   "Created" timestamp with time zone NOT NULL,
   "CreatedBy" text,
   "LastModified" timestamp with time zone NOT NULL,
   "LastModifiedBy" text,
   CONSTRAINT "PK_Payrolls" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Payrolls_ApplicationUserId" ON "public"."Payrolls" ("ApplicationUserId");
CREATE INDEX "IX_Payrolls_UserId" ON "public"."Payrolls" ("UserId");






CREATE TABLE "public"."Permissions"(
   "Id" uuid NOT NULL,
   "Name" text NOT NULL,
   "Description" text NOT NULL,
   "CreatedDate" timestamp with time zone NOT NULL,
   CONSTRAINT "PK_Permissions" PRIMARY KEY ("Id")
);




CREATE TABLE "public"."RolePermissions"(
   "RoleId" text NOT NULL,
   "PermissionId" uuid NOT NULL,
   CONSTRAINT "PK_RolePermissions" PRIMARY KEY ("RoleId", "PermissionId")
);

CREATE INDEX "IX_RolePermissions_PermissionId" ON "public"."RolePermissions" ("PermissionId");






CREATE TABLE "public"."UserPermissions"(
   "UserId" text NOT NULL,
   "PermissionId" uuid NOT NULL,
   CONSTRAINT "PK_UserPermissions" PRIMARY KEY ("UserId", "PermissionId")
);

CREATE INDEX "IX_UserPermissions_PermissionId" ON "public"."UserPermissions" ("PermissionId");




CREATE TABLE "public"."AspNetRoles"(
   "Id" text NOT NULL,
   "Name" character varying(256),
   "NormalizedName" character varying(256),
   "ConcurrencyStamp" text,
   CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id")
);

CREATE UNIQUE INDEX "RoleNameIndex" ON "public"."AspNetRoles" ("NormalizedName");





CREATE TABLE "public"."AspNetUserRoles"(
   "UserId" text NOT NULL,
   "RoleId" text NOT NULL,
   CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId")
);

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "public"."AspNetUserRoles" ("RoleId");
