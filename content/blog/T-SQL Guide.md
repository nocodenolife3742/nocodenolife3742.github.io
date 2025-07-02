---
title: T-SQL Guide
date: 2025-07-02
authors:
  - name: nocodenolife3742
    link: https://github.com/nocodenolife3742
    image: https://github.com/nocodenolife3742.png
tags:
  - T-SQL
  - SQL Server
  - Database
  - Guide
---

# A Systematic & Comprehensive Guide to T-SQL

## Part 1: The Foundations of Querying

This section covers the absolute essentials for retrieving data. Every T-SQL user starts here.

### 1.1. Basic Syntax & Comments

All T-SQL statements end with an optional semicolon (`;`). It's best practice to use them. Comments are ignored by the server.

```sql
-- This is a single-line comment.
SELECT 1;

/*
This is a multi-line
comment block.
*/
```

### 1.2. The Core `SELECT` Statement

Used to query the database and retrieve data.

```sql
-- Select all columns (use sparingly in production)
SELECT * FROM Employees;

-- Select specific columns and use aliases for better readability
SELECT
    FirstName,
    LastName,
    Email AS ContactEmail
FROM Employees;
```

### 1.3. Filtering Results (`WHERE` Clause)

Extracts only records that fulfill a specified condition.

```sql
-- Standard comparison operators: =, <>, <, >, <=, >=
SELECT * FROM Employees WHERE DepartmentID = 1;
SELECT * FROM Employees WHERE Salary > 75000;

-- Logical operators: AND, OR, NOT
SELECT * FROM Employees WHERE Salary > 50000 AND DepartmentID = 2;

-- Specialized operators
SELECT * FROM Employees WHERE HireDate BETWEEN '2020-01-01' AND '2022-12-31';
SELECT * FROM Employees WHERE FirstName LIKE 'J%';          -- Starts with J
SELECT * FROM Employees WHERE Email LIKE '%@company.com';   -- Ends with
SELECT * FROM Employees WHERE LastName LIKE '_o%';          -- Second letter is 'o'
SELECT * FROM Employees WHERE DepartmentID IN (1, 3, 5);    -- In a list
SELECT * FROM Employees WHERE PhoneNumber IS NOT NULL;      -- Check for non-NULL values
```

### 1.4. Sorting Results (`ORDER BY` Clause)

Sorts the result-set in ascending or descending order.

```sql
-- Sort by a single column (ASC is the default)
SELECT * FROM Employees ORDER BY LastName ASC;

-- Sort by salary in descending order
SELECT * FROM Employees ORDER BY Salary DESC;

-- Sort by multiple columns
SELECT * FROM Employees ORDER BY DepartmentID ASC, Salary DESC;
```

### 1.5. Limiting Results (`TOP`, `OFFSET`/`FETCH`)

Specifies the number of records to return, essential for pagination.

```sql
-- Get the top 10 highest paid employees
SELECT TOP (10) * FROM Employees ORDER BY Salary DESC;

-- Get the top 1% of employees
SELECT TOP (1) PERCENT * FROM Employees ORDER BY HireDate ASC;

-- Pagination: Skip 20 rows and return the next 10 (SQL Server 2012+)
SELECT * FROM Employees
ORDER BY EmployeeID
OFFSET 20 ROWS
FETCH NEXT 10 ROWS ONLY;
```

---

## Part 2: Structuring & Manipulating Data (DDL & DML)

Commands for creating database structures (DDL) and for adding, changing, and removing data (DML).

### 2.1. Data Definition Language (DDL)

Used to create and manage database objects.

```sql
-- Create and use a new database
CREATE DATABASE MyCompanyDB;
GO
USE MyCompanyDB;

-- Create a schema for organization and security
CREATE SCHEMA Sales;
GO

-- Create a table with data types and constraints
CREATE TABLE Employees (
    EmployeeID   INT PRIMARY KEY IDENTITY(1,1), -- Auto-incrementing PK
    FirstName    NVARCHAR(50) NOT NULL,         -- Unicode string, cannot be null
    LastName     NVARCHAR(50) NOT NULL,
    Email        VARCHAR(100) UNIQUE,           -- Value must be unique
    HireDate     DATE DEFAULT GETDATE(),        -- Sets a default value
    Salary       DECIMAL(10, 2) CHECK (Salary > 0), -- Value must meet condition
    DepartmentID INT NULL,                      -- Can be NULL
    CONSTRAINT FK_Emp_Dept FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);

-- Modify an existing table
ALTER TABLE Employees ADD IsActive BIT NOT NULL DEFAULT 1;

-- Delete a table and all its data (irreversible!)
DROP TABLE Employees;
```

### 2.2. Data Manipulation Language (DML)

Used to interact with the data inside the tables.

```sql
-- INSERT: Add new rows.
INSERT INTO Employees (FirstName, LastName, Email, Salary, DepartmentID)
VALUES ('John', 'Doe', 'john.doe@email.com', 60000, 1);

-- UPDATE: Modify existing rows. (WARNING: Always use a WHERE clause!)
UPDATE Employees
SET Salary = Salary * 1.10
WHERE EmployeeID = 1;

-- DELETE: Remove existing rows. (WARNING: Always use a WHERE clause!)
DELETE FROM Employees
WHERE IsActive = 0;

-- TRUNCATE TABLE: Deletes all rows quickly. Resets IDENTITY.
TRUNCATE TABLE LogStaging;
```

### 2.3. The `MERGE` Statement

Performs `INSERT`, `UPDATE`, or `DELETE` operations in a single statement to synchronize two tables.

```sql
MERGE TargetTable AS T
USING SourceTable AS S ON T.ID = S.ID
WHEN MATCHED THEN
    UPDATE SET T.Data = S.Data
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ID, Data) VALUES (S.ID, S.Data)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
```

---

## Part 3: Advanced Data Retrieval & Transformation

Techniques for combining, aggregating, and reshaping data.

### 3.1. Combining Data (`JOIN`s & `APPLY`)

`JOIN`s combine columns from multiple tables. `APPLY` invokes a function for each row of an outer table.

```sql
-- INNER JOIN: Returns only rows where the join condition is met.
SELECT e.FirstName, d.DepartmentName
FROM Employees AS e INNER JOIN Departments AS d ON e.DepartmentID = d.DepartmentID;

-- LEFT JOIN: Returns all rows from the left table and matched rows from the right.
SELECT e.FirstName, d.DepartmentName
FROM Employees AS e LEFT JOIN Departments AS d ON e.DepartmentID = d.DepartmentID;

-- CROSS APPLY: Runs a function for each row, returning results only if the function returns rows.
-- Example: Get the last 2 orders for each customer.
SELECT c.CustomerName, o.OrderID, o.OrderDate
FROM Customers AS c
CROSS APPLY (
    SELECT TOP 2 OrderID, OrderDate
    FROM Orders o WHERE o.CustomerID = c.CustomerID
    ORDER BY OrderDate DESC
) AS o;

-- OUTER APPLY: Always returns the outer row, even if the function returns no results.
-- OUTER APPLY: Returns all rows from the outer table, with NULLs if the function/table expression returns no rows.
-- Example: Get the last 2 orders for each customer, including customers with no orders.
SELECT c.CustomerName, o.OrderID, o.OrderDate
FROM Customers AS c
OUTER APPLY (
    SELECT TOP 2 OrderID, OrderDate
    FROM Orders o WHERE o.CustomerID = c.CustomerID
    ORDER BY OrderDate DESC
) AS o;
```

### 3.2. Aggregating Data (`GROUP BY` & `HAVING`)

Used with aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) to group rows into summary rows.

```sql
-- Count employees and get average salary per department.
SELECT
    DepartmentID,
    COUNT(EmployeeID) AS NumberOfEmployees,
    AVG(Salary) AS AverageSalary
FROM Employees
GROUP BY DepartmentID;

-- HAVING filters the results of a GROUP BY.
-- Show only departments with more than 5 employees.
SELECT
    DepartmentID,
    COUNT(*) AS NumberOfEmployees
FROM Employees
GROUP BY DepartmentID
HAVING COUNT(*) > 5;
```

### 3.3. Subqueries & Common Table Expressions (CTEs)

Ways to nest queries. CTEs are often more readable and are required for recursion.

```sql
-- Subquery: Find employees in departments located in 'New York'.
SELECT * FROM Employees
WHERE DepartmentID IN (SELECT DepartmentID FROM Departments WHERE Location = 'New York');

-- CTE: The same query, but more organized.
WITH NY_Departments AS (
    SELECT DepartmentID FROM Departments WHERE Location = 'New York'
)
SELECT * FROM Employees e
JOIN NY_Departments nyd ON e.DepartmentID = nyd.DepartmentID;
```

### 3.4. Set Operators (`UNION`, `INTERSECT`, `EXCEPT`)

Combine the result-sets of two or more `SELECT` statements.

```sql
-- UNION: Combines results, removing duplicates.
SELECT City FROM Suppliers UNION SELECT City FROM Customers;

-- UNION ALL: Combines results, keeping duplicates (faster).
SELECT City FROM Suppliers UNION ALL SELECT City FROM Customers;

-- INTERSECT: Returns only rows that appear in both queries.
SELECT City FROM Suppliers INTERSECT SELECT City FROM Customers;

-- EXCEPT: Returns rows from the first query that are NOT in the second.
SELECT City FROM Suppliers EXCEPT SELECT City FROM Customers;
```

### 3.5. Reshaping Data (`PIVOT` & `UNPIVOT`)

Rotates a table by turning unique values from one column into multiple columns (`PIVOT`), or the reverse (`UNPIVOT`).

```sql
-- PIVOT: Change sales data from rows to columns by year.
SELECT
    ProductName, [2021], [2022], [2023]
FROM
(
    SELECT ProductName, SalesYear, Amount FROM ProductSales
) AS SourceTable
PIVOT
(
    SUM(Amount) -- The value to be aggregated
    FOR SalesYear IN ([2021], [2022], [2023]) -- Column values become new column headers
) AS PivotTable;

-- UNPIVOT: The reverse operation.
SELECT ProductName, SalesYear, Amount
FROM PivotedProductSales
UNPIVOT
(
    Amount FOR SalesYear IN ([2021], [2022], [2023])
) AS UnpivotTable;
```

---

## Part 4: Advanced Analysis & Programmability

Analytical functions and procedural T-SQL for creating complex, reusable logic.

### 4.1. Window Functions

Perform a calculation across a set of rows related to the current row, without collapsing the rows like `GROUP BY`.

```sql
SELECT
    FirstName,
    Salary,
    DepartmentName,
    -- Ranking Functions
    ROW_NUMBER() OVER(PARTITION BY DepartmentName ORDER BY Salary DESC) AS RowNum,
    RANK()       OVER(PARTITION BY DepartmentName ORDER BY Salary DESC) AS Rank,      -- Gaps on ties (1,2,2,4)
    DENSE_RANK() OVER(PARTITION BY DepartmentName ORDER BY Salary DESC) AS DenseRank, -- No gaps (1,2,2,3)
    NTILE(4)     OVER(PARTITION BY DepartmentName ORDER BY Salary DESC) AS Quartile,  -- Divides into N groups

    -- Aggregate Functions
    SUM(Salary) OVER(PARTITION BY DepartmentName) AS TotalDeptSalary,

    -- Positional Functions
    LAG(Salary, 1, 0) OVER(PARTITION BY DepartmentName ORDER BY HireDate) AS PreviousHireSalary
FROM Employees e
JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```

### 4.2. Control Flow (`IF`/`ELSE`, `CASE`, `WHILE`)

Control the execution flow of scripts.

```sql
-- IF/ELSE Logic
IF (SELECT AVG(Salary) FROM Employees) > 60000
    PRINT 'Average salary is high.';
ELSE
    PRINT 'Average salary is moderate.';

-- CASE Statement (inline IF/ELSE)
SELECT
    Salary,
    CASE WHEN Salary > 80000 THEN 'High' ELSE 'Standard' END AS SalaryBand
FROM Employees;

-- WHILE Loop
DECLARE @Counter INT = 0;
WHILE @Counter < 5
BEGIN
    SET @Counter = @Counter + 1;
    PRINT 'Current count: ' + CAST(@Counter AS VARCHAR);
END;
```

### 4.3. Reusable Code: Stored Procedures & Functions

Encapsulate logic for reuse, security, and performance.

```sql
-- Stored Procedure: An action query with parameters.
CREATE OR ALTER PROCEDURE dbo.sp_GetEmployeesByDept (@DepartmentID INT)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Employees WHERE DepartmentID = @DepartmentID;
END;
GO
EXEC dbo.sp_GetEmployeesByDept @DepartmentID = 1;


-- User-Defined Function (Scalar): Returns a single value.
CREATE OR ALTER FUNCTION dbo.fn_GetEmployeeFullName (@EmployeeID INT)
RETURNS NVARCHAR(101) AS
BEGIN
    RETURN (SELECT FirstName + ' ' + LastName FROM Employees WHERE EmployeeID = @EmployeeID);
END;
```

### 4.4. Hierarchical Data & Recursive CTEs

Use a Common Table Expression that refers to itself to traverse hierarchies.

```sql
WITH EmployeeHierarchy AS (
    -- Anchor member: The top of the hierarchy
    SELECT EmployeeID, ManagerID, FirstName, 0 AS HierarchyLevel
    FROM Employees WHERE ManagerID IS NULL
    UNION ALL
    -- Recursive member: Joins back to the CTE
    SELECT e.EmployeeID, e.ManagerID, e.FirstName, eh.HierarchyLevel + 1
    FROM Employees AS e
    INNER JOIN EmployeeHierarchy AS eh ON e.ManagerID = eh.EmployeeID
)
SELECT REPLICATE('    ', HierarchyLevel) + FirstName AS OrgChart
FROM EmployeeHierarchy;
```

### 4.5. Working with JSON Data (SQL Server 2016+)

Natively query and create JSON.

```sql
DECLARE @json NVARCHAR(MAX) = N'{"name":"John","skills":["SQL","C#"]}';

-- Read a single value from JSON
SELECT JSON_VALUE(@json, '$.name') AS Name;

-- Shred a JSON array into a relational table
SELECT value AS Skill FROM OPENJSON(@json, '$.skills');

-- Create a JSON string from a query
SELECT EmployeeID, FirstName FROM Employees WHERE DepartmentID = 1 FOR JSON PATH;
```

### 4.6. Error Handling & Transactions

Group statements into an atomic unit and handle runtime errors gracefully.

```sql
BEGIN TRANSACTION;
BEGIN TRY
    -- Perform related DML operations
    UPDATE Accounts SET Balance = Balance - 100 WHERE AccountID = 'A';
    UPDATE Accounts SET Balance = Balance + 100 WHERE AccountID = 'B';

    COMMIT TRANSACTION; -- Make changes permanent
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION; -- Undo all changes
    THROW; -- Bubble the error up to the calling application
END CATCH;
```

---

## Part 5: Performance & Optimization

Tools and techniques to make your queries run faster.

### 5.1. Indexes

Special lookup tables used to speed up data retrieval.

-   **Clustered Index**: Determines the physical order of data. Only one per table. A `PRIMARY KEY` usually creates this.
-   **Non-Clustered Index**: A separate structure with a pointer to the data. Many can exist per table.

```sql
-- Create an index on a column frequently used in WHERE clauses or JOINs.
CREATE NONCLUSTERED INDEX IX_Employees_LastName
ON Employees (LastName, FirstName); -- A "covering" index on two columns
```

### 5.2. Temporary Storage

Used to hold intermediate results in complex queries.

| Type             | Syntax                       | Scope                 | Statistics    | Best Use Case                                      |
| ---------------- | ---------------------------- | --------------------- | ------------- | -------------------------------------------------- |
| **Temp Table**   | `CREATE TABLE #Temp`         | Current session       | Yes           | Large datasets, needs indexes, complex joins.      |
| **Table Variable** | `DECLARE @Tbl TABLE(...)`    | Current batch         | No (mostly)   | Small datasets, simple list storage.               |
| **CTE**          | `WITH CteName AS (...)`      | Single statement      | N/A           | Improving readability, recursive queries.          |

### 5.3. Execution Plans

The single most important tool for troubleshooting query performance. It shows how SQL Server is executing your query.

-   In SQL Server Management Studio (SSMS), press `Ctrl+M` (Include Actual Execution Plan) before running a query.
-   **Look For**: High-cost operators (%), thick arrows (many rows), Table Scans (often bad), Key Lookups, and warnings (e.g., missing index suggestions).