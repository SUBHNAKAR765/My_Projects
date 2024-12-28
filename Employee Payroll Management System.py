import json

# Employee class definition
class Employee:
    def __init__(self, emp_id, name, age, position, salary=0, hours_worked=0, hourly_rate=0):
        self.emp_id = emp_id
        self.name = name
        self.age = age
        self.position = position
        self.salary = salary  # Fixed monthly salary
        self.hours_worked = hours_worked  # For hourly employees
        self.hourly_rate = hourly_rate  # For hourly employees

    def calculate_salary(self):
        """Calculate monthly salary based on employee type (fixed salary or hourly)."""
        if self.position.lower() == "hourly":
            return self.hours_worked * self.hourly_rate
        else:
            return self.salary

    def display_employee_info(self):
        print(f"Employee ID: {self.emp_id}")
        print(f"Name: {self.name}")
        print(f"Age: {self.age}")
        print(f"Position: {self.position}")
        print(f"Monthly Salary: {self.calculate_salary()}")
        print("-" * 30)

# Employee Payroll Management System
class PayrollSystem:
    def __init__(self):
        self.employees = []
        self.load_data()

    def add_employee(self):
        emp_id = input("Enter employee ID: ")
        name = input("Enter employee name: ")
        age = int(input("Enter employee age: "))
        position = input("Enter employee position (fixed/hourly): ")
        if position.lower() == "hourly":
            hours_worked = float(input("Enter hours worked in the month: "))
            hourly_rate = float(input("Enter hourly rate: "))
            employee = Employee(emp_id, name, age, position, 0, hours_worked, hourly_rate)
        else:
            salary = float(input("Enter fixed monthly salary: "))
            employee = Employee(emp_id, name, age, position, salary)

        self.employees.append(employee)
        print(f"Employee {name} added successfully.")
        self.save_data()

    def view_all_employees(self):
        if not self.employees:
            print("No employees in the system.")
        for emp in self.employees:
            emp.display_employee_info()

    def generate_payslip(self, emp_id):
        for emp in self.employees:
            if emp.emp_id == emp_id:
                print(f"--- Payslip for {emp.name} ---")
                print(f"Employee ID: {emp.emp_id}")
                print(f"Name: {emp.name}")
                print(f"Position: {emp.position}")
                print(f"Monthly Salary: {emp.calculate_salary()}")
                print("------------------------------")
                return
        print("Employee not found.")

    def save_data(self):
        """Save employee data to a file (for persistence)."""
        data = []
        for emp in self.employees:
            data.append(emp.__dict__)
        with open("employees.json", "w") as f:
            json.dump(data, f)

    def load_data(self):
        """Load employee data from a file (if it exists)."""
        try:
            with open("employees.json", "r") as f:
                data = json.load(f)
                for emp_data in data:
                    emp = Employee(**emp_data)
                    self.employees.append(emp)
        except FileNotFoundError:
            pass

    def menu(self):
        while True:
            print("\n--- Employee Payroll Management System ---")
            print("1. Add new employee")
            print("2. View all employees")
            print("3. Generate payslip")
            print("4. Exit")
            choice = input("Enter your choice: ")

            if choice == '1':
                self.add_employee()
            elif choice == '2':
                self.view_all_employees()
            elif choice == '3':
                emp_id = input("Enter employee ID to generate payslip: ")
                self.generate_payslip(emp_id)
            elif choice == '4':
                print("Exiting the system.")
                break
            else:
                print("Invalid choice. Please try again.")

if __name__ == "__main__":
    payroll = PayrollSystem()
    payroll.menu()
