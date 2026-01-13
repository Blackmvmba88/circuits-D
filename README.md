# circuits-D

Interactive cognitive electronics workbench for documenting, measuring and understanding real circuits. Bridges physical boards with digital analysis, guided measurement, procedural diagnostics and exportable documentation.

## Features

### 🔌 Component Visualization
- Interactive circuit schematic with SVG rendering
- Real-time component status indicators
- Visual representation of nets and connections
- Detailed component cards with specifications
- Click-to-select components with 2D ↔ 3D synchronization

### 📦 3D Board Editor (UPGRADED!)
- **Interactive 3D Layout Editor**
  - Edit mode with component drag-and-drop in 3D space
  - Grid snapping (5mm) for precise placement
  - 90° rotation controls for component orientation
  - TransformControls for intuitive manipulation
- **Component Properties Panel**
  - Real-time editing of RefDes, type, position, rotation
  - Visual feedback for selected components
  - Net connections display
- **Net Visualization**
  - Simple line rendering between connected components
  - Color-coded connections based on net IDs
- **2D ↔ 3D Synchronization**
  - Click component in 2D → highlights and selects in 3D
  - Click component in 3D → shows details and logs
- **Persistent Board State**
  - All 3D layouts saved to localStorage
  - Real-time component rendering with Three.js
  - OrbitControls for intuitive camera navigation

### 🔧 Circuit Builder (NEW!)
- **Interactive Circuit Design**
  - Create circuits from scratch with guided forms
  - Add components with RefDes, type, value, and pins
  - Define nets with voltage levels and node connections
  - Circuit type categorization (amplifier, filter, power supply, etc.)
- **Component Management**
  - Add/remove components dynamically
  - Visual list of all components in circuit
  - Full component specification entry
- **Netlist Support**
  - Internal netlist model with node connections
  - Link components to specific nets
  - Voltage level tracking per net

### 📸 Photo Capture (Phase 0)
- **Board Photo Input**
  - Upload interface for PCB photos
  - Image preview and metadata display
  - Stub implementation ready for future CV integration
- **Roadmap for Computer Vision**
  - Phase 1: Manual component annotation
  - Phase 2: Automatic component detection
  - Phase 3: Net tracing from copper traces

### 📋 Measurement Workflows
- Step-by-step guided measurement procedures
- Progress tracking and status indicators
- Expected vs. actual value comparison
- Interactive workflow management
- **Enhanced with Net/Component Linking**
  - Steps can reference specific nets and components
  - Support for multiple measurement sources (manual, serial, USB, BLE)
  - Future-ready for hardware integration

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

# Start with demo circuit loaded
npm run demo

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
│   │   ├── ComponentPropertiesPanel.tsx  # NEW
│   │   ├── CircuitBuilder.tsx            # NEW
│   │   ├── PhotoCapture.tsx              # NEW
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
├── examples/               # Example circuits
│   └── led-regulator.json  # Simple LED circuit example
├── public/                 # Static assets
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── CONTRIBUTING.md         # Contribution guidelines
└── ROADMAP.md              # 3D Viewer development roadmap
```

## Usage

### 2D Schematic View
View and interact with circuit schematics, components, and nets. See real-time connection status and component specifications. **Click on any component to highlight it in 3D view.**

### 3D Board Editor
Visualize and edit your PCB in 3D with interactive camera controls and editing capabilities:
- **View Mode**: 
  - Rotate: Left-click and drag
  - Pan: Right-click and drag (or Shift + left-click)
  - Zoom: Scroll wheel
  - Click components to select and view details
- **Edit Mode** (click "Edit Mode" button):
  - Drag components in X-Z plane (snaps to 5mm grid)
  - Use side panel to edit RefDes, type, position, rotation
  - Rotate components 90° with rotation controls
  - View net connections for each component
  
### Circuit Builder
Create circuits from scratch with an intuitive form-based interface:
- Define circuit name, type, and description
- Add components with specifications
- Create nets and define connections
- Save circuits to your workspace

### Photo Capture
Upload photos of physical PCBs for future analysis (Phase 0 stub):
- Upload board photos
- Preview images
- Prepare for future computer vision integration

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
- `MeasurementWorkflow`: Guided measurement procedures with steps and measurement source support
- `MeasurementSource`: Support for manual, serial, USB, and BLE measurement sources
- `DiagnosticLog`: System activity and event logging
- `Persona`: Expert role definitions
- `AppState`: Global application state with automatic persistence

## Examples

Check out the `examples/` directory for sample circuits:
- **LED Regulator** (`led-regulator.json`): Simple LED circuit with current limiting resistor
  - Complete circuit definition with components and nets
  - 3D board layout
  - Measurement workflow for verification
  - Run with `npm run demo` to load automatically

## Future Enhancements

See [ROADMAP.md](./ROADMAP.md) for detailed development plans.

**Phase 1 Roadmap (Computer Vision Integration)**:
- Manual component annotation from photos
- Automatic component detection
- PCB outline extraction
- Net tracing from copper traces

**Phase 2 Roadmap (Hardware Integration)**:
- Real-time hardware connectivity (serial, USB, BLE)
- Automatic data acquisition from measurement instruments
- Live measurement visualization in 3D

**Phase 3 Roadmap (Advanced Features)**:
- Backend integration for data synchronization
- Advanced circuit simulation
- Collaborative features
- Import/Export to PCB design tools (KiCad, Gerber, etc.)
- Circuit analysis algorithms
- Component library management with 3D models
- Heatmap visualization (power, signal integrity)
- Multi-layer PCB visualization

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Reporting issues
- Proposing features
- Adding components or personas
- Submitting pull requests
- Development guidelines

## License

This project is open source and available under the MIT License.

## Author

**Blackmvmba88**

---

*Built with ❤️ using Vite, React, and TypeScript*
