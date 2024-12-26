#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Define constants
#define MAX_ITEMS 50
#define MAX_USERS 50

// Structures for user, menu item, and order
typedef struct {
    char username[50];
    char password[50];
    int isAdmin;
} User;

typedef struct {
    char itemName[50];
    float price;
    int stock;
} MenuItem;

typedef struct {
    char itemName[50];
    int quantity;
    float totalCost;
} Order;

// File names
const char *userFile = "users.txt";
const char *menuFile = "menu.txt";
const char *feedbackFile = "feedback.txt";

// Function prototypes
void userAuthentication();
void login();
void registerUser();
int isAdminUser(const char *username);

void menuManagement();
void addMenuItem();
void updateMenuItem();
void removeMenuItem();
void viewMenu();

void orderProcessing();
void placeOrder();
void generateBill(Order orders[], int count, float total);

void inventoryManagement();
void restockItem();
void checkInventory();

void feedbackCollection();
void collectFeedback();
void viewFeedback();

// Helper functions
void loadMenu(MenuItem menu[], int *menuCount);
void saveMenu(MenuItem menu[], int menuCount);

int main() {
    int choice;
    printf("Welcome to the Mess Management System\n");

    while (1) {
        printf("\nMain Menu:\n");
        printf("1. User Authentication\n");
        printf("2. Menu Management\n");
        printf("3. Order Processing\n");
        printf("4. Inventory Management\n");
        printf("5. Feedback Collection\n");
        printf("6. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                userAuthentication();
                break;
            case 2:
                menuManagement();
                break;
            case 3:
                orderProcessing();
                break;
            case 4:
                inventoryManagement();
                break;
            case 5:
                feedbackCollection();
                break;
            case 6:
                printf("Exiting system. Goodbye!\n");
                exit(0);
            default:
                printf("Invalid choice. Please try again.\n");
        }
    }

    return 0;
}

// User Authentication Module
void userAuthentication() {
    int choice;
    printf("\nUser Authentication\n");
    printf("1. Login\n");
    printf("2. Register\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);

    if (choice == 1) {
        login();
    } else if (choice == 2) {
        registerUser();
    } else {
        printf("Invalid choice.\n");
    }
}

void login() {
    FILE *file = fopen(userFile, "r");
    if (!file) {
        printf("Error opening user file.\n");
        return;
    }

    char username[50], password[50];
    printf("Enter username: ");
    scanf("%s", username);
    printf("Enter password: ");
    scanf("%s", password);

    User user;
    int found = 0;
    while (fscanf(file, "%s %s %d", user.username, user.password, &user.isAdmin) != EOF) {
        if (strcmp(user.username, username) == 0 && strcmp(user.password, password) == 0) {
            found = 1;
            if (user.isAdmin) {
                printf("Welcome, Admin!\n");
            } else {
                printf("Welcome, %s!\n", username);
            }
            break;
        }
    }

    fclose(file);

    if (!found) {
        printf("Invalid username or password.\n");
    }
}

void registerUser() {
    FILE *file = fopen(userFile, "a");
    if (!file) {
        printf("Error opening user file.\n");
        return;
    }

    User user;
    printf("Enter a username: ");
    scanf("%s", user.username);
    printf("Enter a password: ");
    scanf("%s", user.password);
    printf("Is this user an admin? (1 for Yes, 0 for No): ");
    scanf("%d", &user.isAdmin);

    fprintf(file, "%s %s %d\n", user.username, user.password, user.isAdmin);
    fclose(file);
    printf("User registered successfully!\n");
}

// Menu Management Module
void menuManagement() {
    int choice;
    printf("\nMenu Management\n");
    printf("1. Add Menu Item\n");
    printf("2. Update Menu Item\n");
    printf("3. Remove Menu Item\n");
    printf("4. View Menu\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);

    switch (choice) {
        case 1:
            addMenuItem();
            break;
        case 2:
            updateMenuItem();
            break;
        case 3:
            removeMenuItem();
            break;
        case 4:
            viewMenu();
            break;
        default:
            printf("Invalid choice.\n");
    }
}

void addMenuItem() {
    MenuItem menu[MAX_ITEMS];
    int menuCount;
    loadMenu(menu, &menuCount);

    MenuItem newItem;
    printf("Enter item name: ");
    scanf("%s", newItem.itemName);
    printf("Enter price: ");
    scanf("%f", &newItem.price);
    printf("Enter stock quantity: ");
    scanf("%d", &newItem.stock);

    menu[menuCount++] = newItem;
    saveMenu(menu, menuCount);

    printf("Menu item added successfully.\n");
}

void updateMenuItem() {
    MenuItem menu[MAX_ITEMS];
    int menuCount;
    loadMenu(menu, &menuCount);

    char itemName[50];
    printf("Enter the name of the item to update: ");
    scanf("%s", itemName);

    int found = 0;
    for (int i = 0; i < menuCount; i++) {
        if (strcmp(menu[i].itemName, itemName) == 0) {
            printf("Enter new price: ");
            scanf("%f", &menu[i].price);
            printf("Enter new stock quantity: ");
            scanf("%d", &menu[i].stock);
            found = 1;
            break;
        }
    }

    if (found) {
        saveMenu(menu, menuCount);
        printf("Menu item updated successfully.\n");
    } else {
        printf("Item not found.\n");
    }
}

void removeMenuItem() {
    MenuItem menu[MAX_ITEMS];
    int menuCount;
    loadMenu(menu, &menuCount);

    char itemName[50];
    printf("Enter the name of the item to remove: ");
    scanf("%s", itemName);

    int found = 0;
    for (int i = 0; i < menuCount; i++) {
        if (strcmp(menu[i].itemName, itemName) == 0) {
            for (int j = i; j < menuCount - 1; j++) {
                menu[j] = menu[j + 1];
            }
            menuCount--;
            found = 1;
            break;
        }
    }

    if (found) {
        saveMenu(menu, menuCount);
        printf("Menu item removed successfully.\n");
    } else {
        printf("Item not found.\n");
    }
}

void viewMenu() {
    MenuItem menu[MAX_ITEMS];
    int menuCount;
    loadMenu(menu, &menuCount);

    printf("\nMenu:\n");
    for (int i = 0; i < menuCount; i++) {
        printf("Item: %s | Price: %.2f | Stock: %d\n", menu[i].itemName, menu[i].price, menu[i].stock);
    }
}

// Order Processing Module
void orderProcessing() {
    MenuItem menu[MAX_ITEMS];
    int menuCount;
    loadMenu(menu, &menuCount);

    Order orders[MAX_ITEMS];
    int orderCount = 0;
    float totalCost = 0;

    while (1) {
        char itemName[50];
        int quantity;

        printf("\nEnter the name of the item to order (or 'done' to finish): ");
        scanf("%s", itemName);
        if (strcmp(itemName, "done") == 0) {
            break;
        }

        printf("Enter quantity: ");
        scanf("%d", &quantity);

        int found = 0;
        for (int i = 0; i < menuCount; i++) {
            if (strcmp(menu[i].itemName, itemName) == 0) {
                if (menu[i].stock >= quantity) {
                    orders[orderCount].quantity = quantity;
                    menu[i].stock -= quantity;
                    orders[orderCount].totalCost = menu[i].price * quantity;
                    strcpy(orders[orderCount].itemName, menu[i].itemName);
                    totalCost += orders[orderCount].totalCost;
                    orderCount++;
                    printf("Order added successfully.\n");
                    found = 1;
                } else {
                    printf("Insufficient stock.\n");
                }
                break;
            }
        }

        if (!found) {
            printf("Item not found.\n");
        }
    }

    saveMenu(menu, menuCount);
    generateBill(orders, orderCount, totalCost);
}
void generateBill(Order orders[], int count, float total) {
    printf("\nBill Summary:\n");
    printf("Item Name\tQuantity\tTotal Cost\n");
    printf("-------------------------------------------\n");

    for (int i = 0; i < count; i++) {
        printf("%-15s\t%d\t\t%.2f\n", orders[i].itemName, orders[i].quantity, orders[i].totalCost);
    }

    printf("-------------------------------------------\n");
    printf("Total Amount: %.2f\n", total);
}

// Inventory Management Module
void inventoryManagement() {
    int choice;
    printf("\nInventory Management\n");
    printf("1. Restock Item\n");
    printf("2. Check Inventory\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);

    switch (choice) {
        case 1:
            restockItem();
            break;
        case 2:
            checkInventory();
            break;
        default:
            printf("Invalid choice.\n");
    }
}

void restockItem() {
    MenuItem menu[MAX_ITEMS];
    int menuCount;
    loadMenu(menu, &menuCount);

    char itemName[50];
    int additionalStock;

    printf("Enter the name of the item to restock: ");
    scanf("%s", itemName);
    printf("Enter the quantity to add: ");
    scanf("%d", &additionalStock);

    int found = 0;
    for (int i = 0; i < menuCount; i++) {
        if (strcmp(menu[i].itemName, itemName) == 0) {
            menu[i].stock += additionalStock;
            found = 1;
            break;
        }
    }

    if (found) {
        saveMenu(menu, menuCount);
        printf("Item restocked successfully.\n");
    } else {
        printf("Item not found.\n");
    }
}

void checkInventory() {
    MenuItem menu[MAX_ITEMS];
    int menuCount;
    loadMenu(menu, &menuCount);

    printf("\nCurrent Inventory:\n");
    printf("Item Name\tStock\n");
    printf("---------------------\n");

    for (int i = 0; i < menuCount; i++) {
        printf("%-15s\t%d\n", menu[i].itemName, menu[i].stock);
    }
}

// Feedback Collection Module
void feedbackCollection() {
    int choice;
    printf("\nFeedback Collection\n");
    printf("1. Submit Feedback\n");
    printf("2. View Feedback\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);

    switch (choice) {
        case 1:
            collectFeedback();
            break;
        case 2:
            viewFeedback();
            break;
        default:
            printf("Invalid choice.\n");
    }
}

void collectFeedback() {
    FILE *file = fopen(feedbackFile, "a");
    if (!file) {
        printf("Error opening feedback file.\n");
        return;
    }

    char feedback[200];
    printf("Enter your feedback: ");
    getchar(); // Clear input buffer
    fgets(feedback, sizeof(feedback), stdin);

    fprintf(file, "%s", feedback);
    fclose(file);
    printf("Thank you for your feedback!\n");
}

void viewFeedback() {
    FILE *file = fopen(feedbackFile, "r");
    if (!file) {
        printf("Error opening feedback file.\n");
        return;
    }

    char feedback[200];
    printf("\nCustomer Feedback:\n");
    printf("---------------------\n");

    while (fgets(feedback, sizeof(feedback), file)) {
        printf("%s", feedback);
    }

    fclose(file);
}

// Helper Functions
void loadMenu(MenuItem menu[], int *menuCount) {
    FILE *file = fopen(menuFile, "r");
    if (!file) {
        *menuCount = 0;
        return;
    }

    *menuCount = 0;
    while (fscanf(file, "%s %f %d", menu[*menuCount].itemName, &menu[*menuCount].price, &menu[*menuCount].stock) != EOF) {
        (*menuCount)++;
    }

    fclose(file);
}

void saveMenu(MenuItem menu[], int menuCount) {
    FILE *file = fopen(menuFile, "w");
    if (!file) {
        printf("Error saving menu.\n");
        return;
    }

    for (int i = 0; i < menuCount; i++) {
        fprintf(file, "%s %.2f %d\n", menu[i].itemName, menu[i].price, menu[i].stock);
    }

    fclose(file);
}