#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void insertProducts();
void displayProducts();
void searchProducts();
void updateProducts();
void deleteProducts();
float BillProducts();

struct Products
{
    int serialno;
    char name[50];
    char name_;
    char Company[20];
    int quantity;
    float price;
};

//*************************************************************************************************************
// Menu in Products System
struct Products item[20];
int count = 0, i = 0;
int main()
{
    int choice, n = 1;

    while (n)
    {
        printf("\n");
        printf("\t\t\t\t|   STOCK MANAGEMENT SYSTEM   |\n");
        printf("\nMenu:\n");
        printf("1. Insert Products\n");
        printf("2. Display All Productss\n");
        printf("3. Search Products\n");
        printf("4. Update Products\n");
        printf("5. Delete Products\n");
        printf("6. Bill Products\n");
        printf("0. Exit\n");

        printf("\n\n\n\n\nEnter your choice: ");
        scanf("%d", &choice);
        switch (choice)
        {
        case 1:
            count++;
            insertProducts();
            break;
        case 2:
            displayProducts();
            break;
        case 3:
            searchProducts();
            break;
        case 4:
            updateProducts();
            break;
        case 5:
            deleteProducts();
            break;
        case 6:
            BillProducts();
            break;
        case 0:
            printf("Exiting...\n");
            exit(0);
            break;
        default:
            printf("Invalid choice\n");
        }
    }

    return 0;
}

//*********************************************************************************************************************
// Inserting Products in Input
void insertProducts()
{
    if (i < 100)
    {
        printf("Enter serialno: ");
        scanf("%d", &item[i].serialno);
        printf("The name of the Products: ");
        scanf("%s", item[i].name);
        printf("The Company: ");
        scanf("%s", item[i].Company);
        printf("The price: ");
        scanf("%f", &item[i].price);
        printf("The quantity: ");
        scanf("%d", &item[i].quantity);

        i++;
        printf("Products added successfully!\n");
    }
    else
    {
        printf("item is full \n");
    }
}

//*********************************************************************************************************************
// Displaying Products on Screen
void displayProducts()
{

    if (count > 0)
    {
        printf("\nProducts item:\n");
        printf("%-10s%-12s%-15s%-19s%-24s\n", "serialno", "Name", "Company", "Quantity", "Price");
        for (int i = 0; i < count; i++)
        {
            printf("%-10d  %-12s  %-15s  %-19d  %-24f\n",item[i].serialno, item[i].name, item[i].Company, item[i].quantity, item[i].price);
        }
    }
    else
    {
        printf("item is empty.\n");
    }
}

//********************************************************************************************************************
// Search for Products
void searchProducts()
{
    int i, check = 0;
    char temp[30];
    printf("Enter the name of Products:","serialno", "Name", "Company", "Quantity", "Price");
    scanf("%29s", &temp);
    for (i = 0; i < count; i++)
    {
        if (strstr(item[i].name, temp))
        {
            check++;
            printf("Products found\n");
            printf("%-10s %-12s %-15s %-19s %-24s\n","serialno", "Name", "Company", "Quantity", "Price");
            printf("%-10s  %-12d  %-15f  %-19s  %-24s\n",item[i].serialno, item[i].name, item[i].Company, item[i].quantity, item[i].price);
            break;
        }
    }
    if (check == 0)
    {
        printf("Products Not Found.\n");
    }
}

//********************************************************************************************************************
// Update Products item
void updateProducts()
{
    int j, check = 0;
    char name;
    char temp[30];
    printf("Enter Products Name is to be updated:","serialno", "Name", "Company", "Quantity", "Price");
    scanf("%s", &temp);
    for (j = 0; j < count; j++)
    {
        if (strstr(item[j].name, temp))
        {
            check++;
            // Display the details of the Products to update
            printf("Products details that need to be updated :\n");
            printf("%-10s %-12s %-15s %-19s %-24s\n","serialno", "Name", "Company", "Quantity", "Price");
            printf("%-10s  %-12d  %-15f  %-19s  %-24s\n",item[i].serialno, item[i].name, item[i].Company, item[i].quantity, item[i].price);

            // Prompt the user to update data
            printf("Enter new details for the Products:\n");

            printf("serialno: ");
            scanf("%d", &item[j].serialno);

            printf("Name of the product: ");
            scanf("%s", item[j].name);

            printf("Company: ");
            scanf("%s", item[j].Company);

            printf("Quantity: ");
            scanf("%d", &item[j].quantity);

            printf("Price: ");
            scanf("%f", &item[j].price);

            printf("\n \nProducts details have been updated successfully.\n");

            break;
        }
    }

    if (check == 0)
    {
        printf("Products name Not Found!\n");
    }
}

//***************************************************************************************************************
// Delete Products item
void deleteProducts()
{
    int j, m, check = 0;
    char name;
    char temp[30];
    printf("Enter Products Name is to be Deleted: ");
    scanf("%s", &temp);
    for (j = 0; j < count; j++)
    {
        if (strstr(item[j].name, temp))
        {
            check++;
            for (m = j + 1; m <= count; m++)
            {
                item[j] = item[m];
                j++;
            }
            count--;
            break;
        }
    }
    if (check == 0)
    {
        printf("Products Name Not Found!\n");
    }
    if (count == 0)
    {
        printf("No Products Found! Please Enter Products First.\n");
    }
    else if (count > 0)
    {
        printf("New Records:--\n");
        printf("%-10s %-12s %-15s %-19s %-24s\n","serialno", "Name", "Company", "Quantity", "Price");
        for (j = 1; j <= count; j++)
        {
            printf("%-10s  %-12d  %-15f  %-19s  %-24s\n",item[j-1].serialno, item[j-1].name, item[j-1].Company, item[j-1].quantity, item[j-1].price);
        }
        printf("\nTotal number of records=%d\n", count);
    }
}

//*************************************************************************************************************************
// For making Products Bill
float BillProducts()
{
    float Bill = 0.0;

    for (int i = 0; i < count; i++)
    {
        Bill += item[i].price * item[i].quantity;
    }

    // Display the bill
    printf("\nProducts item:\n");
    printf("%-10s%-12s%-15s%-19s%-24s\n","serialno", "Name", "Company", "Quantity", "Price");
    for (int i = 0; i < count; i++)
    {
        printf("%-10s  %-12d  %-15f  %-19s  %-24s\n",item[i].serialno, item[i].name, item[i].Company, item[i].quantity, item[i].price);
    }

    // Calculate and display the Bill
    printf("\n\nTotal Bill for Products: %.2f\n", Bill);

    return 0;
}
