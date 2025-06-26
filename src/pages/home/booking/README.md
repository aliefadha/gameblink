# Booking Layout System

This directory contains a comprehensive booking system with a unified layout that manages the entire booking flow.

## Components

### BookingLayout.tsx
The main layout component that:
- Manages the entire booking flow across 3 steps
- Provides progress tracking with visual indicators
- Handles navigation between steps
- Ensures proper data validation before allowing step progression
- Uses the existing `UseFormStore` for state management

### Individual Step Components
- **BookingPage.tsx** - Step 1: User data collection (name, phone, email)
- **BookingCabang.tsx** - Step 2: Branch selection
- **BookingJadwal.tsx** - Step 3: Schedule and unit selection

## Features

### Progress Tracking
- Visual progress bar showing completion percentage
- Step indicators with numbers and labels
- Active/inactive state styling

### Navigation
- Back/Forward buttons with proper validation
- Automatic redirection if user tries to access steps without required data
- Smooth transitions between steps

### State Management
- Uses existing `UseFormStore` from `@/store/UseFormStore.tsx`
- Maintains data across all steps
- Validates step completion before allowing progression

## Usage

### Basic Implementation
```tsx
import { BookingLayout } from '@/pages/home/booking';

// In your router or main component
<BookingLayout />
```

### Routing Setup
The layout automatically handles routing based on the current URL:
- `/booking` - Step 1 (Data Diri)
- `/booking/cabang` - Step 2 (Pilih Cabang)
- `/booking/jadwal` - Step 3 (Pilih Jadwal)

### Store Integration
The layout uses the existing store structure:
```tsx
// Step 1 data
stepOne: {
  nama: string,
  email: string,
  noHp: string
}

// Step 2 data
stepTwo: {
  id_cabang: string,
  nama_cabang: string
}

// Step 3 data (to be implemented)
stepThree: {
  tanggal_main: string,
  total_harga: number,
  booking_detail: {
    unit_id: string,
    jam_main: string,
    harga: number,
  }[]
}
```

## Styling

The layout uses:
- Consistent background image (`/images/bg-login.png`)
- Logo placement in header
- White rounded container for content
- Responsive design with proper spacing
- Green accent color for active states and buttons

## Customization

### Adding New Steps
1. Add the step to the `steps` array in `BookingLayout.tsx`
2. Create the component for the new step
3. Update the store types if needed
4. Add navigation logic

### Modifying Styling
- Update the CSS classes in `BookingLayout.tsx`
- Modify the progress bar styling
- Adjust the header layout

### Adding Validation
- Update the `canGoForward` function in `BookingLayout.tsx`
- Add validation logic for new steps
- Modify the `useEffect` hooks for step access control 