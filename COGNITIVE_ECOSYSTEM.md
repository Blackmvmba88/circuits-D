# Cognitive Ecosystem: The Complete Vision

> **"Un organismo integrado donde cada capa alimenta a la siguiente, sin fracturas ni mutilaciones."**

---

## 🎯 The Objective: A Cognitive Ecosystem for Electronics

**circuits-D** is not just a tool — it's a **cognitive ecosystem** where electronics education, design, analysis, and understanding converge into a unified organism.

This document contains the **complete integrated vision** — all layers working together, all phases building on each other, all rules reinforcing the system.

### What Makes This an Ecosystem?

Traditional electronics tools are **fragmented**:
- Design tools don't talk to measurement tools
- Physical boards are disconnected from digital analysis
- Learning is separate from doing
- Aesthetics are separate from function
- Rules exist in heads, not in systems

**Our ecosystem integrates everything:**

```
Physical Reality ↔ Digital Representation ↔ Human Understanding ↔ Aesthetic Experience
         ↕                    ↕                       ↕                      ↕
    3D Space         Electrical Network        Cognitive Meaning        Visual Beauty
```

---

## ✅ Core Elements (Already Integrated)

These foundational pieces are already part of the ecosystem:

### 1. **Rules**
- Electrical safety rules (no acute angles, diode protection)
- Component placement constraints
- Geometric snapping rules
- Validation and error prevention

### 2. **Engineering**
- Netlist model (first-class citizens)
- Component specifications and datasheets
- Electrical connectivity
- Measurement workflows

### 3. **Aesthetics**
- Beautiful 3D visualization
- Color-coded nets and components
- Clean, intuitive UI design
- Visual feedback for all interactions

### 4. **Cognition**
- Causal diagnostic rules (IF condition → THEN consequence)
- Semantic layer connecting measurements to meaning
- Expert knowledge capture
- Real-time rule evaluation

### 5. **3D Space**
- Interactive 3D board viewer
- Component placement and editing
- Grid snapping and alignment
- Camera controls and navigation

### 6. **Sensors & Measurement**
- Measurement workflow system
- Multi-source support (manual, serial, USB, BLE)
- Expected vs. actual value comparison
- Live measurement integration (future)

### 7. **Living Datasheets**
- Component specifications linked to physical parts
- Net voltage tracking
- Test point definitions
- Dynamic documentation generation

### 8. **Magnetic Breadboard**
- Physical components with magnetic snapping
- Enforced electrical rules during assembly
- Geometric constraints
- Self-correcting placement (future)

### 9. **Self-Assembly**
- Guided component placement
- Snap-to-grid positioning
- Automatic orientation
- Connection validation

### 10. **Restoration**
- State persistence (localStorage)
- Session restoration
- Undo/redo capabilities (future)
- Version control integration (future)

### 11. **Explanation**
- Detailed cognitive diagnostics
- "Why" behind every rule trigger
- Technical explanations with EE theory
- Educational content embedded

---

## 🧅 System Layers: From Atoms to Mind to Beauty

The ecosystem is structured in **seven interconnected layers**, each building on the previous:

### 1. **Physical Layer** (Capa Física)

**What**: The real, tangible hardware and components.

**Components**:
- Physical PCB boards with copper traces
- Electronic components (resistors, capacitors, ICs, LEDs)
- Solder joints and mechanical connections
- 3D space with real dimensions (mm, cm)
- Material properties (copper, FR4, component packages)

**Key Properties**:
- Position in 3D space (X, Y, Z coordinates)
- Physical dimensions (length, width, height)
- Component footprints and pad layouts
- Thermal and mechanical constraints
- Real-world limitations (no overlapping components)

**Interactions**:
- Magnetic snapping for component placement
- Physical constraints enforcement
- Collision detection
- Grid-based positioning (5mm grid)

**Example**:
```
Component: R1 (Resistor 1kΩ)
Position: (25mm, 0mm, 15mm)
Size: 6mm × 3mm × 3mm
Package: 0805
Rotation: 0°
```

---

### 2. **Geometric Layer** (Capa Geométrica)

**What**: The mathematical representation of physical space and component relationships.

**Components**:
- 3D coordinates and transforms
- Rotation matrices and orientation
- Grid systems and snapping points
- Spatial relationships between components
- Board boundaries and keepout zones

**Key Properties**:
- Euclidean geometry in 3D space
- Coordinate systems (absolute and relative)
- Rotation in 90° increments
- Distance calculations between components
- Alignment and distribution rules

**Rules**:
- ✅ Components must snap to 5mm grid
- ✅ No overlapping components
- ✅ Maintain minimum clearance distances
- ✅ Align components for visual cleanliness
- ✅ No acute angles in traces (future)

**Interactions**:
- TransformControls for interactive manipulation
- Grid visualization overlay
- Snap-to-grid magnetism
- Auto-alignment suggestions

**Example**:
```
Grid: 5mm × 5mm
Component R1:
  Position: grid(5, 0, 3) → (25mm, 0mm, 15mm)
  Rotation: 90° → aligned with Y-axis
  Neighbors: [C1 at (25mm, 0mm, 25mm), U1 at (30mm, 0mm, 15mm)]
```

---

### 3. **Electrical Layer** (Capa Eléctrica)

**What**: The flow of current, voltage, and signals through the circuit.

**Components**:
- Netlist (the connectivity graph)
- Nets with voltage levels and current flow
- Component pins and their electrical connections
- Test points for measurement
- Power rails and ground planes

**Key Properties**:
- Voltage at each net (e.g., VCC = 5V, GND = 0V)
- Current through components
- Resistance, capacitance, inductance values
- Signal types (DC, AC, digital, analog)
- Power consumption and dissipation

**Rules**:
- ✅ All nets must have unique IDs
- ✅ Components must connect to valid nets
- ✅ Power nets must meet voltage requirements
- ✅ Current limiting for LEDs and sensitive components
- ✅ Proper grounding for all circuits

**Interactions**:
- Net visualization as colored lines in 3D
- Voltage probing at test points
- Measurement workflow integration
- Real-time electrical state updates

**Example**:
```
Net: VCC
  Voltage: 5.0V
  Connected Components: [U1.VCC, R1.pin1, C1.pin1]
  Type: Power Rail
  Current: 45mA
  
Net: LED_ANODE
  Voltage: 3.2V (measured)
  Connected Components: [R1.pin2, LED1.anode]
  Type: Signal Net
  Current: 15mA
```

---

### 4. **Semantic Layer** (Capa Semántica)

**What**: The **meaning** behind measurements and circuit states. The "what does this mean?" layer.

**Components**:
- Causal diagnostic rules (IF → THEN)
- Component function descriptions
- Circuit topology analysis
- Functional blocks (power supply, amplifier, filter)
- Design intent and purpose

**Key Properties**:
- Causal relationships (voltage drop → LED won't light)
- Functional descriptions (this is a voltage regulator)
- Expected behaviors (oscillator should run at 16MHz)
- Failure modes (what breaks when X fails)
- Design rationale (why this component value)

**Rules Library** (see dedicated section below):
- Power rules: voltage drops, rail failures
- Signal rules: oscillation failures, signal loss
- Timing rules: propagation delays
- Component rules: thermal runaway, opens, shorts

**Interactions**:
- Diagnostic rule evaluation engine
- "Why" explanations for every diagnosis
- Predicted consequences of failures
- Guided troubleshooting workflows

**Example**:
```
Rule: LED Undervoltage
  IF: VCC < 2.0V
  THEN: LED will not illuminate
  WHY: LED forward voltage (1.8V) + resistor drop requires 
       minimum 2.0V. Below this, insufficient current flows.
  Severity: Warning
  Affected: [LED1, R1, VCC net]
```

---

### 5. **Cognitive Layer** (Capa Cognitiva)

**What**: Human understanding, learning, and expertise capture. This is where the system **thinks** and **teaches**.

**Components**:
- Expert personas (Circuit Designer, Test Engineer, Debug Specialist)
- Learning pathways and educational content
- Diagnostic knowledge base
- User guidance and suggestions
- Cognitive workflows (measure → understand → diagnose → fix)

**Key Properties**:
- Multi-level explanations (beginner, intermediate, expert)
- Progressive disclosure of complexity
- Contextual help and hints
- Pattern recognition (this looks like a power supply issue)
- Expertise transfer (capture senior engineer knowledge)

**Cognitive Workflows**:
1. **Understanding**: What is this circuit? What does it do?
2. **Analysis**: How does it work? What are the key nodes?
3. **Measurement**: Where should I probe? What should I see?
4. **Diagnosis**: What's wrong? Why is it wrong?
5. **Repair**: How do I fix it? What parts do I need?

**Interactions**:
- Active personas providing guidance
- Diagnostic logging with explanations
- Real-time suggestions ("Try measuring VCC first")
- Educational tooltips and documentation
- Conversational diagnostics (dialogue with the circuit)

**Example**:
```
Persona: Debug Specialist (Active)
  Context: User measuring LED circuit
  Suggestion: "VCC is low. Check the power supply first. 
               A weak battery or faulty regulator could 
               cause this. Expected: 5V, Actual: 1.5V"
  
Learning Moment:
  "LEDs need about 1.8-2.0V forward voltage plus the 
   voltage drop across the resistor. With 1.5V total, 
   there's not enough voltage to turn on the LED."
```

---

### 6. **Pedagogical Layer** (Capa Pedagógica)

**What**: Structured learning and teaching. Making electronics **teachable** and **learnable**.

**Components**:
- Step-by-step tutorials
- Guided exercises and challenges
- Concept explanations with visuals
- Progressive difficulty levels
- Assessment and feedback

**Key Properties**:
- Curriculum structure (fundamentals → advanced)
- Learning objectives per lesson
- Interactive exercises (build a circuit, measure, diagnose)
- Immediate feedback loops
- Scaffolded complexity (hide details initially)

**Teaching Methods**:
- **Show**: Visual 3D representation
- **Explain**: Why components are connected this way
- **Guide**: Step-by-step measurement procedures
- **Correct**: Real-time feedback on mistakes
- **Reinforce**: Repeated patterns and principles

**Educational Content**:
- Ohm's Law in practice
- Voltage dividers and current limiting
- Capacitor filtering and decoupling
- Transistor biasing
- Oscillator principles
- Power supply design

**Interactions**:
- Tutorial mode with highlighted steps
- Quiz questions embedded in workflows
- Progress tracking and achievements
- Difficulty adjustment based on user level
- "Explain Like I'm 5" mode for beginners

**Example**:
```
Lesson: Current Limiting Resistors for LEDs
  
  Step 1: Learn the Concept
    "LEDs need a resistor to limit current. Without it, 
     they draw too much current and burn out."
  
  Step 2: Calculate the Value
    Formula: R = (Vsupply - Vled) / Iled
    Example: R = (5V - 2V) / 0.020A = 150Ω
  
  Step 3: Build the Circuit
    "Place R1 (150Ω) in series with LED1."
  
  Step 4: Measure and Verify
    "Measure voltage across R1. Should be ~3V."
    "Measure current through LED. Should be ~20mA."
  
  Step 5: Experiment
    "What happens if you remove the resistor? (Don't actually do it!)"
    Answer: "Current spikes, LED overheats and fails."
```

---

### 7. **Aesthetic Layer** (Capa Estética)

**What**: Visual beauty, user experience, and emotional connection. Making electronics **delightful**.

**Components**:
- Color schemes and visual design
- Smooth animations and transitions
- Typography and layout
- Icons and visual metaphors
- Sound feedback (future)

**Key Properties**:
- Visual hierarchy (what's important stands out)
- Color coding (nets, voltages, states)
- Spatial layout (organized, not cluttered)
- Motion design (smooth, purposeful animations)
- Accessibility (readable, high contrast)

**Design Principles**:
- **Clarity**: No confusion, clear intent
- **Consistency**: Same patterns throughout
- **Feedback**: Immediate response to actions
- **Delight**: Small moments of joy
- **Beauty**: Electronics can be gorgeous

**Visual Language**:
- 🟢 Green: OK, working, expected
- 🟡 Yellow: Warning, check this
- 🔴 Red: Error, critical, failure
- 🔵 Blue: Information, guidance
- ⚪ Gray: Inactive, disabled

**Interactions**:
- Smooth 3D camera movements
- Highlighted components on hover
- Color transitions for state changes
- Progress indicators for workflows
- Satisfying snap-to-grid magnetism

**Example**:
```
Component Selection Animation:
  1. User clicks component in 2D
  2. 3D camera smoothly pans to component
  3. Component pulses with highlight color
  4. Properties panel slides in from right
  5. Selection indicator appears
  
Net Visualization:
  - Power nets: Bold red/black lines
  - Signal nets: Thin colored lines (unique per net)
  - Ground: Dashed gray lines
  - Active nets (being measured): Glowing animation
```

---

## 📈 Development Phases: From Atom to Ecosystem

The ecosystem grows in stages, each phase building on the previous:

### **Phase 0: Foundation** ✅ COMPLETE

**Goal**: Core infrastructure and basic functionality.

**Deliverables**:
- ✅ React + TypeScript + Vite setup
- ✅ Component visualization (2D schematic)
- ✅ Basic 3D viewer with Three.js
- ✅ Data models for circuits, components, nets
- ✅ State management with localStorage persistence
- ✅ Diagnostic logging system
- ✅ Export capabilities (PDF, BOM, Markdown)

**Status**: Complete (January 2026)

---

### **Phase 1: Physical & Geometric Layers** ✅ COMPLETE

**Goal**: Enable 3D visualization and editing of physical boards.

**Deliverables**:
- ✅ Interactive 3D board editor
- ✅ Component placement with drag-and-drop
- ✅ Grid snapping (5mm grid)
- ✅ Rotation controls (90° increments)
- ✅ Component properties panel
- ✅ 2D ↔ 3D synchronization
- ✅ Persistent 3D layouts

**Status**: Complete (January 2026)

---

### **Phase 2: Electrical Layer** 🟡 IN PROGRESS

**Goal**: Visualize and work with electrical connections and measurements.

**Deliverables**:
- ✅ Basic net visualization (lines between components)
- ✅ Color-coded nets
- ✅ Measurement workflow system
- ✅ Test point definitions
- ✅ Multi-source measurement support (manual, serial, USB, BLE)
- 🚧 Pin-to-pin detailed net rendering (future)
- 🚧 Voltage annotations in 3D (future)
- 🚧 Real-time hardware measurement integration (future)

**Status**: Partially complete (January 2026)
**Target**: Q2 2026 for advanced features

---

### **Phase 3: Semantic & Cognitive Layers** ✅ COMPLETE

**Goal**: Add meaning, understanding, and diagnostic intelligence.

**Deliverables**:
- ✅ Causal diagnostic rule system
- ✅ Rule evaluation engine
- ✅ "IF → THEN → WHY" framework
- ✅ Active diagnosis display
- ✅ Severity levels (critical, warning, info)
- ✅ Expert personas (Circuit Designer, Test Engineer, Debug Specialist)
- ✅ Diagnostic knowledge panel
- ✅ Real-time rule evaluation

**Status**: Complete (January 2026)

---

### **Phase 4: Pedagogical Layer** 🔜 PLANNED

**Goal**: Transform the system into a teaching and learning platform.

**Deliverables**:
- 🔜 Tutorial system with guided lessons
- 🔜 Interactive exercises and challenges
- 🔜 Progressive difficulty levels
- 🔜 Assessment and feedback mechanisms
- 🔜 Educational content library
- 🔜 Learning paths for different skill levels
- 🔜 "Explain Like I'm 5" mode

**Target**: Q3 2026

---

### **Phase 5: Integration & Hardware** 🔜 PLANNED

**Goal**: Connect to real hardware and complete the physical ↔ digital loop.

**Deliverables**:
- 🔜 Serial port integration for real-time data
- 🔜 USB measurement device support
- 🔜 Bluetooth Low Energy (BLE) connectivity
- 🔜 Live measurement visualization in 3D
- 🔜 Automatic data acquisition
- 🔜 Hardware-in-the-loop testing

**Target**: Q4 2026

---

### **Phase 6: Computer Vision** 🔜 PLANNED

**Goal**: Bridge from physical boards to digital models automatically.

**Deliverables**:
- 🔜 Photo upload and preprocessing
- 🔜 Manual component annotation (Phase 1)
- 🔜 Automatic component detection (Phase 2)
- 🔜 PCB outline extraction
- 🔜 Net tracing from copper traces (Phase 3)
- 🔜 3D model generation from photos

**Target**: 2027

---

### **Phase 7: Advanced Ecosystem** 🔮 FUTURE

**Goal**: Complete the cognitive ecosystem with collaborative and advanced features.

**Deliverables**:
- 🔮 Collaborative features (share circuits, annotations)
- 🔮 Cloud synchronization and backup
- 🔮 Import/Export to KiCad, Gerber, EAGLE
- 🔮 Component library with 3D models
- 🔮 Heatmap visualization (power, signal integrity)
- 🔮 Multi-layer PCB support
- 🔮 AR/VR support (WebXR)
- 🔮 AI-powered rule generation
- 🔮 Community rule library
- 🔮 Simulation integration (SPICE)

**Target**: 2027+

---

## 📚 Rule Library: Embedded Expertise

The **Rule Library** is the heart of the Semantic Layer. It contains the diagnostic knowledge that makes the system intelligent.

### Rule Categories

#### **1. Power Rules (Reglas de Alimentación)**

**Purpose**: Detect power supply issues that cause system failures.

**Examples**:

```
Rule: VCC Undervoltage
  IF: VCC < 4.75V (for 5V systems)
  THEN: Microcontroller may not boot or operate erratically
  WHY: Most 5V MCUs require minimum 4.75V for reliable operation.
       Below this, brown-out reset triggers intermittently.
  Severity: Critical
  
Rule: Excessive Voltage Drop
  IF: (Vsource - Vload) > 0.5V across short trace
  THEN: Trace resistance too high, possible poor solder joint
  WHY: Copper traces should have negligible resistance. Large
       voltage drops indicate high resistance connections.
  Severity: Warning
  
Rule: Power Rail Ripple
  IF: AC component on DC rail > 100mV
  THEN: Insufficient filtering, decoupling capacitors needed
  WHY: Switching noise and transients need to be filtered.
       Without adequate decoupling, noise affects sensitive circuits.
  Severity: Warning
```

---

#### **2. Current Rules (Reglas de Corriente)**

**Purpose**: Prevent component damage from overcurrent.

**Examples**:

```
Rule: LED Current Limiting
  IF: LED connected without series resistor
  THEN: LED will experience thermal runaway and burn out
  WHY: LEDs have negative temperature coefficient. As they heat,
       forward voltage drops, increasing current, creating positive
       feedback. Resistor limits maximum current.
  Severity: Critical
  
Rule: Regulator Overcurrent
  IF: Load current > 80% of regulator max rating
  THEN: Regulator will overheat and may shut down
  WHY: Voltage regulators have thermal limits. Above 80% rated
       current, junction temperature rises rapidly, triggering
       thermal shutdown.
  Severity: Warning
  
Rule: Fuse Sizing
  IF: Fuse rating < 1.5× normal operating current
  THEN: Fuse will blow during startup or transients
  WHY: Inrush current during power-on can be 2-3× normal current.
       Fuse must tolerate startup surge without blowing.
  Severity: Info
```

---

#### **3. Signal Rules (Reglas de Señal)**

**Purpose**: Detect signal integrity and connectivity issues.

**Examples**:

```
Rule: Oscillator Failure
  IF: Crystal load capacitors missing or wrong value
  THEN: Oscillator will not start or run at wrong frequency
  WHY: Crystals are specified with a load capacitance (e.g., 18pF).
       Load caps must match spec for reliable oscillation.
  Severity: Critical
  
Rule: Signal Loss
  IF: Expected signal present = false (no activity detected)
  THEN: Circuit path is open or driver is not functioning
  WHY: If a signal should be present but isn't, check for
       broken traces, disconnected components, or failed drivers.
  Severity: Warning
  
Rule: Signal Attenuation
  IF: Signal amplitude < 50% of expected
  THEN: High impedance path or loading issue
  WHY: Signals should maintain amplitude. Excessive loss indicates
       impedance mismatch, loading, or poor connections.
  Severity: Warning
```

---

#### **4. Timing Rules (Reglas de Temporización)**

**Purpose**: Detect timing-related issues in digital circuits.

**Examples**:

```
Rule: Clock Jitter
  IF: Clock frequency variance > 1%
  THEN: Timing violations possible, system may be unstable
  WHY: Digital circuits require stable clock timing. Jitter
       causes setup/hold time violations in flip-flops.
  Severity: Warning
  
Rule: Propagation Delay
  IF: Signal delay between two points > expected
  THEN: Trace too long, requires buffering or impedance matching
  WHY: Long traces have capacitance and inductance that slow
       signal edges and cause reflections.
  Severity: Info
```

---

#### **5. Filtering Rules (Reglas de Filtrado)**

**Purpose**: Ensure proper filtering and noise suppression.

**Examples**:

```
Rule: Decoupling Capacitor Placement
  IF: Decoupling cap more than 5mm from IC power pins
  THEN: Ineffective at high frequencies, noise will couple into IC
  WHY: At high frequencies, even short traces have inductance.
       Decoupling caps must be placed immediately at IC pins.
  Severity: Warning
  
Rule: Filter Cutoff Frequency
  IF: RC filter cutoff > 10× signal frequency
  THEN: Filter is ineffective, noise passes through
  WHY: Filter cutoff frequency must be well below noise frequency.
       Rule of thumb: cutoff at 1/10th of noise frequency.
  Severity: Warning
  
Rule: Capacitor ESR
  IF: Capacitor ESR > 1Ω (for decoupling applications)
  THEN: Filter stops blocking AC ripple, power rail has noise
  WHY: High ESR limits capacitor's ability to supply transient
       currents. Use low-ESR types (ceramic, polymer) for decoupling.
  Severity: Warning
```

---

#### **6. Thermal Rules (Reglas Térmicas)**

**Purpose**: Prevent thermal damage and ensure reliable operation.

**Examples**:

```
Rule: Component Temperature
  IF: Component temperature > 85°C (for consumer grade)
  THEN: Accelerated aging, possible thermal shutdown
  WHY: Most consumer electronics are rated to 85°C. Above this,
       semiconductor lifetime decreases exponentially.
  Severity: Warning
  
Rule: Thermal Runaway
  IF: Component current increasing AND temperature increasing
  THEN: Positive feedback loop, component will fail
  WHY: Some devices (BJTs, diodes) have negative temperature
       coefficients. As temp rises, current increases, causing
       more heating. Needs current limiting.
  Severity: Critical
```

---

#### **7. Geometric Rules (Reglas Geométricas)**

**Purpose**: Ensure physical layout follows best practices.

**Examples**:

```
Rule: Trace Angle
  IF: Trace has acute angle (< 90°)
  THEN: Acid trapping during etching, potential reliability issue
  WHY: Sharp angles trap etchant chemicals, causing over-etching.
       Use 45° or rounded corners instead.
  Severity: Info
  
Rule: Component Clearance
  IF: Distance between components < 2mm
  THEN: Assembly difficulty, possible shorts
  WHY: Solder bridges can form between closely spaced components.
       Maintain minimum clearance for manufacturability.
  Severity: Warning
  
Rule: Edge Clearance
  IF: Component < 3mm from board edge
  THEN: Risk of damage during handling or mounting
  WHY: Board edges are vulnerable. Components near edges can be
       damaged during depanelization or mounting.
  Severity: Info
```

---

### Rule Structure

Each rule in the library follows this structure:

```typescript
interface DiagnosticRule {
  id: string;                    // Unique identifier
  name: string;                  // Human-readable name
  category: RuleCategory;        // Power, Signal, Timing, etc.
  condition: Condition[];        // What to check
  consequence: string;           // What will fail
  explanation: string;           // Why it fails (technical details)
  severity: 'critical' | 'warning' | 'info';
  affectedNets?: string[];       // Which nets are involved
  affectedComponents?: string[]; // Which components are involved
  suggestedFix?: string;         // How to resolve (optional)
  references?: string[];         // Links to datasheets, app notes (optional)
}
```

### Adding Rules to the Library

Users and developers can contribute rules:

1. **Built-in Rules**: Pre-defined in the system
2. **User Rules**: Created through the UI
3. **Community Rules**: Shared rule libraries (future)
4. **AI-Generated Rules**: ML-based suggestions (future)

---

## 🧲 Assembly Prototype: The Magnetic Breadboard

### Concept

A **physical breadboard with magnetic components** that enforces electrical and geometric rules during assembly.

### How It Works

#### **1. Magnetic Snapping**

**Physical**:
- Components have magnets in standardized positions
- Breadboard has magnetic grid points every 5mm
- Components "snap" into place with satisfying feedback

**Digital**:
- 3D view reflects physical positions in real-time
- Grid snapping in software matches physical grid
- Position updates automatically when components move

---

#### **2. Rule Enforcement**

**Electrical Rules**:
- ❌ Cannot place component without current limiting resistor
- ❌ Cannot connect power backwards (polarity protection)
- ❌ Cannot exceed current ratings
- ✅ Green light when circuit is electrically valid

**Geometric Rules**:
- ❌ Cannot place components too close (collision detection)
- ❌ Cannot rotate to invalid angles
- ✅ Snaps to nearest valid position
- ✅ Aligns automatically with nearby components

---

#### **3. Real-Time Feedback**

**Visual**:
- LEDs on breadboard show net status (powered, active, error)
- Color-coded zones for power, ground, signals
- Component outlines show valid placement zones

**Audio** (future):
- Satisfying "click" when snapped correctly
- Warning beep for rule violations
- Success chime when circuit complete

**Haptic** (future):
- Stronger magnetic snap for correct placement
- Resistance when trying to place incorrectly

---

#### **4. Auto-Assembly Mode**

**Guided Assembly**:
1. System shows next component to place (lights up position)
2. User picks up component
3. Component snaps into correct position
4. System confirms and shows next step
5. Repeat until circuit complete

**Self-Correcting**:
- If component placed incorrectly, LEDs flash red
- System suggests correct position
- Component can only snap to valid locations

---

### Physical Components

#### **Smart Components**:
- Embedded identification (RFID or NFC)
- System knows what component was placed
- No manual entry needed

#### **Magnetic Grid Board**:
- 5mm grid spacing
- Embedded sensors for position detection
- LED indicators for guidance
- USB connection to computer

#### **Component Library**:
- Resistors (1Ω to 1MΩ, various power ratings)
- Capacitors (pF to mF, various types)
- LEDs (various colors)
- Transistors (BJT, MOSFET)
- ICs (555, op-amps, regulators)
- Power components (regulators, fuses)
- Sensors (temp, light, motion)

---

### Integration with Software

```
Physical Board ←→ USB/BLE ←→ Computer ←→ circuits-D Software
       ↓                               ↓
   Component           Real-time     3D Visualization
   Placement     ←→   Sync     ←→   & Rule Checking
```

**Real-time synchronization**:
1. User places component on physical board
2. Board detects component ID and position
3. Data sent to software via USB/BLE
4. 3D view updates immediately
5. Rule engine validates placement
6. Feedback sent back to physical board (LEDs)

---

## 🧪 Testing: Cognitive + Hardware

### Testing Philosophy

Testing in a cognitive ecosystem is not just about "does it work?" but "do we understand why it works?"

### Test Categories

#### **1. Cognitive Tests (No Hardware Required)**

**Purpose**: Validate rules, diagnostics, and knowledge.

**Tests**:
- ✅ Rule evaluation logic
- ✅ Condition checking (>, <, =, between)
- ✅ Rule triggering (all conditions met)
- ✅ Explanation generation
- ✅ Severity assignment
- ✅ Affected component identification

**Example**:
```typescript
describe('Cognitive Diagnostics', () => {
  test('LED Undervoltage Rule', () => {
    const circuit = createTestCircuit();
    const rules = loadDiagnosticRules();
    
    // Set VCC to 1.5V (below threshold)
    circuit.nets.find(n => n.id === 'VCC').voltage = 1.5;
    
    // Evaluate rules
    const diagnoses = evaluateRules(rules, circuit);
    
    // Should trigger LED undervoltage rule
    expect(diagnoses).toContainRule('led-undervoltage');
    expect(diagnoses[0].consequence).toContain('LED will not illuminate');
    expect(diagnoses[0].severity).toBe('warning');
  });
});
```

---

#### **2. Geometric Tests**

**Purpose**: Validate 3D layout and positioning.

**Tests**:
- ✅ Grid snapping accuracy
- ✅ Component collision detection
- ✅ Rotation in 90° increments
- ✅ Coordinate transforms
- ✅ Distance calculations

**Example**:
```typescript
describe('3D Layout', () => {
  test('Grid Snapping', () => {
    const component = createComponent3D('R1', 'resistor');
    component.position = [12.7, 0, 8.3]; // Off-grid position
    
    const snapped = snapToGrid(component, 5); // 5mm grid
    
    expect(snapped.position).toEqual([10, 0, 10]); // Nearest grid point
  });
  
  test('Collision Detection', () => {
    const r1 = createComponent3D('R1', 'resistor');
    r1.position = [0, 0, 0];
    r1.size = [6, 3, 3];
    
    const r2 = createComponent3D('R2', 'resistor');
    r2.position = [5, 0, 0]; // Too close
    r2.size = [6, 3, 3];
    
    expect(componentsCollide(r1, r2)).toBe(true);
  });
});
```

---

#### **3. Electrical Tests**

**Purpose**: Validate netlist and electrical rules.

**Tests**:
- ✅ Net connectivity validation
- ✅ Voltage level tracking
- ✅ Current calculations
- ✅ Power dissipation
- ✅ Electrical rule checks (ERC)

**Example**:
```typescript
describe('Electrical Layer', () => {
  test('Current Through LED', () => {
    const circuit = createLEDCircuit();
    
    // Circuit: 5V → R1(150Ω) → LED(Vf=2V) → GND
    const current = calculateCurrent(circuit);
    
    // I = (Vsupply - Vled) / R = (5 - 2) / 150 = 0.02A
    expect(current).toBeCloseTo(0.02, 3);
  });
  
  test('Net Connectivity', () => {
    const circuit = createCircuit();
    const netlist = buildNetlist(circuit);
    
    // VCC should connect to U1.VCC, R1.pin1, C1.pin1
    const vccNet = netlist.find(n => n.id === 'VCC');
    expect(vccNet.connections).toContain('U1.VCC');
    expect(vccNet.connections).toContain('R1.pin1');
    expect(vccNet.connections).toContain('C1.pin1');
  });
});
```

---

#### **4. Hardware Integration Tests (Optional)**

**Purpose**: Validate real hardware connectivity and measurement.

**Tests** (when hardware available):
- 🔌 Serial port communication
- 🔌 USB device enumeration
- 🔌 BLE discovery and pairing
- 🔌 Real-time data acquisition
- 🔌 Measurement accuracy

**Example**:
```typescript
describe('Hardware Integration', () => {
  test('Serial Port Measurement', async () => {
    const port = await connectSerialPort('/dev/ttyUSB0');
    
    // Send measurement command
    await port.write('MEASURE:VCC\n');
    
    // Read response
    const response = await port.read();
    const voltage = parseFloat(response);
    
    expect(voltage).toBeGreaterThan(4.5);
    expect(voltage).toBeLessThan(5.5);
  });
});
```

---

### Test Coverage Goals

- ✅ **Cognitive Rules**: 100% coverage (all rules tested)
- ✅ **Geometric Functions**: 90%+ coverage
- ✅ **Electrical Logic**: 90%+ coverage
- 🔌 **Hardware Integration**: Best effort (requires hardware)

### Continuous Testing

- Run cognitive tests on every commit
- Run geometric/electrical tests before release
- Hardware tests run when hardware available
- Manual testing for UI/UX

---

## 🌐 Integration: All Layers Working Together

### Example: Diagnosing an LED That Won't Light

This example shows how all layers interact in a real-world scenario:

#### **Physical Layer**:
- User has physical LED circuit on breadboard
- Components: 5V supply, 150Ω resistor, red LED

#### **Geometric Layer**:
- Components arranged in series: VCC → R1 → LED → GND
- Positions recorded in 3D: R1 at (0,0,0), LED at (10,0,0)

#### **Electrical Layer**:
- Netlist: VCC (5V) → R1.pin1 → LED_ANODE → LED.anode → GND
- Expected voltages: VCC=5V, LED_ANODE=3V (after resistor drop)

#### **Semantic Layer**:
- User measures VCC: 1.5V (low!)
- Rule triggers: "IF VCC < 2.0V THEN LED will not illuminate"
- Consequence: "Insufficient voltage for LED forward voltage + resistor drop"

#### **Cognitive Layer**:
- System diagnosis: "VCC undervoltage detected"
- Guidance: "Check power supply. Battery may be weak or regulator failing."
- Explanation: "LEDs need ~2V (Vf) + resistor drop. With 1.5V total, not enough."

#### **Pedagogical Layer**:
- Teaching moment: "This is a common issue. Let's learn about voltage drops."
- Interactive quiz: "What's the minimum VCC needed for this circuit?"
- Answer: "2V (LED) + 3V (resistor drop) = 5V (but 4.5V would work with less current)"

#### **Aesthetic Layer**:
- 3D view highlights VCC net in red (error state)
- LED component dims in visualization
- Diagnostic panel shows critical warning with icon
- Smooth animation draws attention to problem area

**Result**: User quickly understands the problem (weak power supply), the reason (insufficient voltage), and the fix (replace battery or use higher voltage source).

---

## 🚀 Scaling the Ecosystem

### The ecosystem is designed to scale from simple to complex:

#### **Level 1: Single LED Circuit**
- A few components
- Basic rules (voltage, current)
- Simple 3D layout
- Beginner-level explanations

#### **Level 2: Microcontroller Board**
- Dozens of components
- Complex rules (timing, decoupling, power rails)
- Multi-zone 3D layout
- Intermediate explanations

#### **Level 3: Multi-Board System**
- Hundreds of components across multiple boards
- Advanced rules (signal integrity, EMI, thermal)
- Full 3D system visualization
- Expert-level content

**The system scales without breaking** because every layer is modular and composable.

---

## 🎓 Educational Impact

### Transforming Electronics Education

**Traditional Electronics Course**:
1. Read theory
2. Solve problems on paper
3. Build circuit (maybe)
4. Measure with multimeter
5. Write report

**With Cognitive Ecosystem**:
1. **See**: 3D visualization of circuit before building
2. **Understand**: Semantic explanations of how it works
3. **Build**: Guided assembly with rule enforcement
4. **Measure**: Systematic workflows with expected values
5. **Diagnose**: Automatic analysis of problems
6. **Learn**: Immediate feedback and explanations
7. **Master**: Repeated practice with increasing complexity

**Result**: Students learn faster, understand deeper, and retain longer.

---

## 🌍 Community & Collaboration

### Open Ecosystem

The cognitive ecosystem is designed for **community contributions**:

#### **Rule Library**:
- Users contribute diagnostic rules
- Community voting on quality
- Expert review and curation
- Shared across all users

#### **Circuit Examples**:
- Library of example circuits with full documentation
- From simple LED to complex systems
- Educational and practical examples
- Tagged by difficulty and topic

#### **Component Models**:
- 3D models for common components
- Electrical characteristics and datasheets
- Contributed by manufacturers and users
- Standardized formats

#### **Educational Content**:
- Tutorials and lessons
- Video explanations
- Interactive exercises
- Multiple languages

---

## 🏁 Conclusion: The Complete Vision

**circuits-D** is not just a tool. It's a **cognitive ecosystem** for electronics — a unified organism where:

- Physical reality and digital representation are one
- Measurement and understanding are inseparable
- Rules prevent mistakes before they happen
- Learning happens naturally, not forcefully
- Beauty and function coexist harmoniously
- Complexity scales gracefully
- Knowledge is captured and shared

### From Atoms to Mind to Beauty

Every layer feeds the next:
- **Physical** components exist in **geometric** space
- **Geometric** relationships define **electrical** connections
- **Electrical** states generate **semantic** meaning
- **Semantic** meaning enables **cognitive** understanding
- **Cognitive** understanding supports **pedagogical** growth
- **Pedagogical** growth is wrapped in **aesthetic** delight

And the cycle completes:
- Understanding leads to better designs
- Better designs become educational examples
- Educational examples generate new rules
- New rules improve understanding

**This is the ecosystem.**

---

## 📖 Related Documents

- [README.md](./README.md) - Main project documentation
- [COGNITIVE_DIAGNOSTICS.md](./COGNITIVE_DIAGNOSTICS.md) - Semantic layer details
- [ROADMAP.md](./ROADMAP.md) - Development phases and timeline
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute

---

**Last Updated**: January 2026

*"De átomo → a mente → a gusto. Sin fracturas. Sin mutilaciones. Un organismo completo."*

🔥 **EPIC MOVE HECHO** 🔥
