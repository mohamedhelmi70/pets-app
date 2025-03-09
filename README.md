# Pet Profile App - React Native Coding Test

## Overview
This is a coding test to create a pet profile application using React Native and Supabase. The application should display pet information along with their health logs in a tabbed interface.

## Requirements

### 1. UI Implementation
Modify the pet profile screen to include:
- A tabbed interface with three sections:
  1. **Weight Logs Tab**
     - Display weight measurements with dates
     - Each log should show:
       - Weight value (in kg)
       - Date of measurement
  
  2. **Body Condition Tab**
     - Display body condition assessments
     - Each log should show:
       - Body condition description (single word/phrase)
       - Date of assessment
  
  3. **Vet Visits Tab**
     - Display veterinary visit records
     - Each log should show:
       - Visit notes (text area)
       - Date of visit
     - Include an "Add new vet visits" button at the bottom

### 2. Supabase Integration
- Create a Supabase account and set up a new project
- Create the following tables:
  ```sql
  -- Pets table
  create table pets (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    species text not null,
    breed text,
    age integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    owner_id uuid references auth.users not null
  );

  -- Weight logs table
  create table weight_logs (
    id uuid default uuid_generate_v4() primary key,
    pet_id uuid references pets not null,
    weight decimal not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Body condition logs table
  create table body_condition_logs (
    id uuid default uuid_generate_v4() primary key,
    pet_id uuid references pets not null,
    body_condition text not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Vet visit logs table
  create table vet_visit_logs (
    id uuid default uuid_generate_v4() primary key,
    pet_id uuid references pets not null,
    notes text not null,
    date timestamp with time zone default timezone('utc'::text, now()) not null
  );
  ```
- Implement data fetching from Supabase in the application
- Handle loading and error states appropriately

### 3. Cross-Platform Compatibility
- Ensure the application works correctly on both:
  - iOS devices/simulators
  - Android devices/emulators
- Test and verify that all features work consistently across platforms

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Supabase account and project at https://supabase.com
4. Copy your Supabase project credentials
5. Create a `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```
6. Start the development server:
   ```bash
   npx expo start
   ```

## Evaluation Criteria
- Code organization and clarity
- UI implementation accuracy
- Supabase integration and data management
- Error handling and loading states
- Cross-platform compatibility
- TypeScript usage and type safety
- Git commit history and incode comments

## Submission
1. Create a new Supabase project
2. Implement the required features
3. Update this README with:
   - Any additional dependencies you've added
   - Any assumptions or decisions you've made
4. Push your code to your own repository
5. Share the repository URL

## Time Expectation
- Expected completion time: 2-4 hours

## Notes
- Feel free to use additional libraries if needed
- Comment your code where necessary
- Include error handling and loading states
- Consider edge cases and data validation
- Focus on code quality and user experience 

## Assumptions & Decisions
  - PetsList screen to display list of pets and make the PetsList as the initial screen of the navigation.