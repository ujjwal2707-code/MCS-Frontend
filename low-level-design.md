**Low-Level Design (LLD)**

**1. Introduction**

This document provides a detailed low-level design for the Mobile Cyber Security (MCS) application. It elaborates on the internal workings of specific components, their data structures, and the sequence of operations for key features.

**2. Detailed Component Design**

**2.1. Authentication Module**

*   **2.1.1. `AuthContext`**
    *   **Purpose:** To provide a global state for user authentication throughout the application.
    *   **State:**
        *   `token: string | null`: Stores the user's authentication token.
        *   `isLoading: boolean`: Indicates whether the authentication status is being loaded from storage.
    *   **Functions:**
        *   `setAuthToken(token: string)`: Saves the authentication token to `AsyncStorage` and updates the state.
        *   `logout()`: Removes the authentication token from `AsyncStorage` and clears the state.
    *   **Diagram:**
        ```plantuml
        @startuml
        class AuthContext {
          +token: string | null
          +isLoading: boolean
          +setAuthToken(token: string): Promise<void>
          +logout(): Promise<void>
        }
        @enduml
        ```

*   **2.1.2. `Login` Screen**
    *   **Purpose:** To provide a user interface for users to log in to the application.
    *   **State:**
        *   `form: { email: string, password: string }`: Stores the user's input for email and password.
    *   **UI Components:**
        *   `InputField`: For email and password input.
        *   `CustomButton`: For submitting the login form and for guest login.
        *   `TouchableOpacity`: For navigating to the registration and "forgot password" screens.
    *   **Logic:**
        1.  The user enters their email and password.
        2.  The `onSignInPress` function is called when the "Sign In" button is pressed.
        3.  The `loginMutation` (from `useMutation`) is triggered, which calls the `apiService.login` method with the user's credentials.
        4.  On success, the `setAuthToken` function from `AuthContext` is called to store the token, and the user is redirected to the main part of the app.
        5.  On error, an error message is displayed to the user.
    *   **Sequence Diagram:**
        ```plantuml
        @startuml
        actor User
        participant LoginScreen as "Login Screen"
        participant AuthService as "apiService.login"
        participant AuthContext

        User -> LoginScreen: Enters credentials
        User -> LoginScreen: Presses "Sign In"
        LoginScreen -> AuthService: login(credentials)
        AuthService -> LoginScreen: Returns token
        LoginScreen -> AuthContext: setAuthToken(token)
        AuthContext -> LoginScreen: Updates auth state
        LoginScreen -> User: Navigates to Home
        @enduml
        ```

**2.2. QR Code Scanning Module**

*   **2.2.1. `ScanQR` Screen**
    *   **Purpose:** To provide a user interface for scanning QR codes using the device's camera.
    *   **State:**
        *   `hasPermissions: boolean`: Tracks whether the user has granted camera permissions.
        *   `scannedData: string | null`: Stores the data scanned from the QR code.
        *   `qrType: QRTypeState`: Stores the detected type of the QR code (e.g., URL, text).
        *   `openScanResult: boolean`: Controls the visibility of the scan result bottom sheet.
    *   **UI Components:**
        *   `Camera`: From `react-native-vision-camera`, displays the camera feed.
        *   `CustomButton`: To request camera permissions.
        *   `ScanQRResult`: A bottom sheet component to display the scan results.
    *   **Logic:**
        1.  The component requests camera permission on mount.
        2.  The `useCodeScanner` hook from `react-native-vision-camera` is used to detect QR codes in the camera feed.
        3.  When a QR code is scanned, the `onCodeScanned` callback is triggered.
        4.  The `handleScannedData` function is called, which updates the `scannedData` and `qrType` state.
        5.  The `ScanQRResult` bottom sheet is displayed with the scanned information.
    *   **Sequence Diagram:**
        ```plantuml
        @startuml
        actor User
        participant ScanQRScreen as "ScanQR Screen"
        participant Camera
        participant ScanQRResult

        User -> ScanQRScreen: Opens the screen
        ScanQRScreen -> Camera: Requests permission
        Camera -> User: Shows permission prompt
        User -> Camera: Grants permission
        ScanQRScreen -> Camera: Activates camera
        Camera -> ScanQRScreen: Scans QR code
        ScanQRScreen -> ScanQRResult: Displays scan results
        @enduml
        ```

*   **2.2.2. `ScanQRResult` Component**
    *   **Purpose:** To display the results of a QR code scan in a bottom sheet.
    *   **Props:**
        *   `isOpen: boolean`: Controls the visibility of the bottom sheet.
        *   `onClose: () => void`: A callback function to close the bottom sheet.
        *   `scannedData: string`: The data scanned from the QR code.
        *   `qrType: string`: The type of the QR code.
    *   **State:**
        *   `scanUrlDetails: DomainReputationResponse | null`: Stores the results of the URL scan from the backend.
    *   **UI Components:**
        *   `BottomSheet`: From `@gorhom/bottom-sheet`, the main container for the component.
        *   `CustomButton`: To trigger a URL scan if the QR code contains a link.
        *   `ScannerResult`: A component to display the detailed analysis of the scanned URL.
    *   **Logic:**
        1.  The component is displayed when the `isOpen` prop is true.
        2.  It displays the scanned data and the detected QR code type.
        3.  If the QR code is a URL, a "Scan URL" button is displayed.
        4.  When the "Scan URL" button is pressed, the `scanUriMutation` is triggered, which calls the `apiService.checkDomainReputation` method.
        5.  The results of the scan are then displayed in the `ScannerResult` component.

**3. Data Models**

*   **`RootStackParamList`:** A type definition that maps the names of the navigation routes to their parameters. This is used by React Navigation to ensure type safety.
*   **`DomainReputationResponse`:** The data structure for the response from the `/domain-reputation` API endpoint. This will contain information about the scanned URL, including its reputation, any detected threats, and a list of security scanners' results.

**4. Error Handling**

*   **API Errors:** The `apiService` class includes a `handleRequest` method that catches errors from Axios requests and throws a standardized `Error` object with a user-friendly message.
*   **Component Errors:** Individual components use the `onError` callback from `useMutation` to handle API errors and display appropriate messages to the user using `CustomToast`.
