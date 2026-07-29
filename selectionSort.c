#include <stdio.h>
// Function to perform Selection Sort
void selectionSort(int arr[], int n) {
   for (int i = 0; i < n - 1; i++) {
       int minIndex = i; // Assume the current index is the smallest
       for (int j = i + 1; j < n; j++) {
           if (arr[j] < arr[minIndex]) {
               minIndex = j; // Update minIndex if a smaller element is found
           }
       }
       // Swap the smallest element with the current element
       if (minIndex != i) {
           int temp = arr[minIndex];
           arr[minIndex] = arr[i];
           arr[i] = temp;
       }
   }
}
int main() {
   int arr[] = {64, 25, 12, 22, 11};
   int n = sizeof(arr) / sizeof(arr[0]);
   printf("Unsorted array:\n");
   for (int i = 0; i < n; i++) {
       printf("%d ", arr[i]);
   }
   printf("\n");
   // Call the selection sort function
   selectionSort(arr, n);
   printf("Sorted array in ascending order:\n");
   for (int i = 0; i < n; i++) {
       printf("%d ", arr[i]);
   }
   printf("\n");
   return 0;
}