# circuits-D

Interactive cognitive electronics workbench for documenting, measuring and understanding real circuits. Bridges physical boards with digital analysis, guided measurement, procedural diagnostics and exportable documentation.

## Features

### 🔌 Component Visualization
- Interactive circuit schematic with SVG rendering
- Real-time component status indicators
- Visual representation of nets and connections
- Detailed component cards with specifications

### 📦 3D Board Viewer (NEW!)
- Interactive 3D visualization of PCB boards
- Real-time component rendering with Three.js
- OrbitControls for intuitive camera navigation
- Component selection and highlighting
- Visual component labels (RefDes)
- Integrated with diagnostic logging

### 📋 Measurement Workflows
- Step-by-step guided measurement procedures
- Progress tracking and status indicators
- Expected vs. actual value comparison
- Interactive workflow management

### 📊 Diagnostic Logging
- Real-time activity logging with timestamps
- Four log levels: Info, Success, Warning, Error
- Expandable log details
- Filterable and clearable log history

### 👥 Personas System
- Multiple expert personas with specialized roles
- Activate/deactivate personas as needed
- Role-based guidance (Circuit Designer, Test Engineer, Debug Specialist)

### 📤 Export Capabilities
- **PDF Export**: Complete circuit documentation
- **BOM Export**: Bill of Materials in Markdown format
- **Markdown Export**: Comprehensive documentation with workflows

### 💾 State Persistence
- Automatic state saving to localStorage
- Persist circuits, workflows, logs, and personas
- Seamless session restoration

## Tech Stack

- **Framework**: Vite + React 19.2
- **Language**: TypeScript 5.9
- **Styling**: Custom CSS
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **3D Graphics**: Three.js + React Three Fiber + Drei
- **Build Tool**: Vite 7.3

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Blackmvmba88/circuits-D.git
cd circuits-D

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### Development Server
The app will be available at `http://localhost:5173/`

## Project Structure

```
circuits-D/
├── src/
│   ├── components/          # React components
│   │   ├── ComponentVisualization.tsx
│   │   ├── Board3DViewer.tsx
│   │   ├── MeasurementWorkflows.tsx
│   │   ├── DiagnosticLogging.tsx
│   │   ├── PersonasSidebar.tsx
│   │   └── ExportPanel.tsx
│   ├── data/               # Mock data and initial state
│   │   └── mockData.ts
│   ├── hooks/              # Custom React hooks
│   │   └── useAppState.ts
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── export.ts
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── ROADMAP.md              # 3D Viewer development roadmap
```

## Usage

### 2D Schematic View
View and interact with circuit schematics, components, and nets. See real-time connection status and component specifications.

### 3D Board View
Visualize your PCB in 3D with interactive camera controls. Click on components to select them and view their details in the diagnostic logs. Use mouse/trackpad to:
- **Rotate**: Left-click and drag
- **Pan**: Right-click and drag (or Shift + left-click)
- **Zoom**: Scroll wheel

### Workflows
Create and execute measurement workflows with step-by-step procedures. Track progress and record measurements against expected values.

### Diagnostic Logs
Monitor all system activities, measurement results, and events in real-time. Filter by severity and expand for detailed information.

### Personas
Activate different expert personas to get specialized guidance:
- **Circuit Designer**: Topology and component selection
- **Test Engineer**: Measurement procedures and validation
- **Debug Specialist**: Troubleshooting and diagnostics

### Export
Generate professional documentation in multiple formats:
- **PDF**: Complete circuit documentation
- **BOM**: Component bill of materials
- **Markdown**: Detailed technical documentation

## Architecture

### Modular Design
- **Separation of Concerns**: Clear distinction between data, logic, and presentation
- **Type Safety**: Full TypeScript coverage with strict mode
- **Component Reusability**: Self-contained, reusable React components
- **State Management**: Custom hook with localStorage persistence

### Data Models
- `Circuit`: Complete circuit definition with components, nets, and test points
- `Board3D`: 3D board representation with dimensions and 3D components
- `Component3D`: 3D component with position, rotation, size, and net connections
- `MeasurementWorkflow`: Guided measurement procedures with steps
- `DiagnosticLog`: System activity and event logging
- `Persona`: Expert role definitions
- `AppState`: Global application state

## Future Enhancements

See [ROADMAP.md](./ROADMAP.md) for detailed 3D viewer development plans.

- Backend integration for data synchronization
- Real-time hardware connectivity
- Advanced circuit simulation
- Collaborative features
- 3D layout editor with component placement
- Import/Export to PCB design tools (KiCad, Gerber, etc.)
- Circuit analysis algorithms
- Component library management with 3D models
- Heatmap visualization (power, signal integrity)
- Multi-layer PCB visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**Blackmvmba88**

---

*Built with ❤️ using Vite, React, and TypeScript*
