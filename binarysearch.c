#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int binary_search(int arr[], int n, int target) {
    int left = 0;
    int right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target)
            return mid;
            
        if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return -1;
}

int main() {
    FILE *fp = fopen("binary_search_time.csv", "w");
    if (fp == NULL) {
        printf("Error: Could not create output file!\n");
        return 1;
    }

    fprintf(fp, "n,time\n");

    int sizes[] = {10000, 50000, 100000, 500000, 1000000, 5000000, 10000000};
    int num_sizes = sizeof(sizes) / sizeof(sizes[0]);
    
    int iterations = 1000000; 

    printf("Running Binary Search Experiment...\n");
    printf("%-12s | %s\n", "Size (n)", "Time for 1M searches (sec)");
    printf("----------------------------------------\n");

    for (int i = 0; i < num_sizes; i++) {
        int n = sizes[i];
        
        int *arr = (int *)malloc(n * sizeof(int));
        if (arr == NULL) {
            printf("Memory allocation failed for n=%d\n", n);
            return 1;
        }

        for (int j = 0; j < n; j++) {
            arr[j] = j;
        }

        int target = n - 1; 

        clock_t start = clock();
        
        for (int k = 0; k < iterations; k++) {
            binary_search(arr, n, target);
        }
        
        clock_t end = clock();

        double time_taken = ((double)(end - start)) / CLOCKS_PER_SEC;

        printf("%-12d | %f\n", n, time_taken);
        fprintf(fp, "%d,%f\n", n, time_taken);

        free(arr);
    }

    fclose(fp);
    printf("Experiment complete. Data saved to 'binary_search_time.csv'.\n");
    
    return 0;
}
