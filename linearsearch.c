#include <stdio.h>
#include<time.h>

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Return the index of the target element
        }
    }
    return -1; // Return -1 if the target element is not found
}

int main() {
	
    int arr[] = {5, 3, 8, 1, 2};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 10;
    
    clock_t t;
    t= clock();
    int result = linearSearch(arr, n, target);
    if (result != -1) {
        printf("Element found at index: %d\n", result);
    } else {
        printf("Element not found in the array.\n");
    }
    t= clock()-t;
    printf("%d", t/CLOCKS_PER_SECOND);
        
    // Structure to store local time
    struct tm* ptr;
    
    // Variable to store current time
    time_t t;
    
    // Get current time
    t = time(NULL);
    
    // Convert it to local time
    ptr = localtime(&t);
    
    // Get the string of local time
    printf("%s", asctime(ptr));
    return 0;
}
