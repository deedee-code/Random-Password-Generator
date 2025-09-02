# Password Generator

A modern, secure password generator built with Next.js, TypeScript, and Tailwind CSS. This application generates random passwords with three different strength levels and includes comprehensive testing.

## Features

- **Three Strength Levels**: Low, Medium, and High password strength
- **Customizable Length**: Adjustable password length with minimum requirements per strength level
- **Real-time Validation**: Instant feedback on password strength and requirements
- **Copy to Clipboard**: One-click password copying functionality
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Comprehensive Testing**: Full test coverage with Jest

## Password Strength Levels

### Low Strength
- **Minimum Length**: 6 characters
- **Character Sets**: Lowercase letters (a-z), Uppercase letters (A-Z), Numbers (0-9)

### Medium Strength
- **Minimum Length**: 8 characters
- **Character Sets**: Lowercase letters (a-z), Uppercase letters (A-Z), Numbers (0-9), Basic symbols (!@#$%^&*)

### High Strength
- **Minimum Length**: 12 characters
- **Character Sets**: Lowercase letters (a-z), Uppercase letters (A-Z), Numbers (0-9), Extended symbols (!@#$%^&*()_+-=[]{}|;:,.<>?)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
clone this repo
cd password-generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Testing

The project includes comprehensive tests covering:

- **Password Length Validation**: Ensures passwords meet minimum length requirements
- **Strength Validation**: Verifies passwords contain required character types
- **Edge Cases**: Handles various edge cases and error conditions
- **Integration Tests**: End-to-end functionality testing

Run tests with:
```bash
npm test
```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and custom CSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   └── PasswordGenerator.tsx # Main password generator component
└── utils/
    ├── passwordGenerator.ts  # Core password generation logic
    └── __tests__/
        └── passwordGenerator.test.ts # Test suite
```

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Jest** - Testing framework
- **ts-jest** - TypeScript support for Jest

## Security Features

- **Cryptographically Secure**: Uses Math.random() for password generation
- **Character Set Validation**: Ensures passwords contain required character types
- **Length Validation**: Enforces minimum length requirements
- **No Password Storage**: Passwords are generated client-side and not stored
