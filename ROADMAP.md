# 3D Board Viewer Roadmap

This document outlines the phased implementation plan for the 3D Board Viewer feature in Circuits Lab.

## ✅ Phase 1 – Viewer 3D (COMPLETED)

**Goal**: Create a basic 3D visualization of PCB boards and components.

- [x] Define `Board3D` and `Component3D` data models
- [x] Integrate three.js + react-three-fiber + @react-three/drei
- [x] Implement 3D canvas with camera controls (OrbitControls)
- [x] Render PCB board as 3D plane
- [x] Display components as 3D boxes with labels
- [x] Add component selection and highlighting
- [x] Integrate with existing state management
- [x] Add diagnostic logging for 3D interactions

**Status**: ✅ Complete

---

## 🎨 Phase 2.5 – Circuit Design & Real World Bridge (COMPLETED ✅)

**Goal**: Enable circuit creation from scratch and prepare for physical board integration.

### Tasks - Circuit Builder
- [x] Circuit constructor UI
  - [x] Form to create new circuits with name, type, description
  - [x] Add/remove components with full specifications
  - [x] Define nets with voltage levels and connections
  - [x] Circuit type categorization
- [x] Component management
  - [x] Visual list of components
  - [x] Component property entry (RefDes, type, value, pins)
  - [x] Dynamic add/remove functionality
- [x] Netlist support
  - [x] Internal netlist model with node connections
  - [x] Link components to nets
  - [x] Voltage tracking per net
- [x] Integration with main app
  - [x] Save created circuits to AppState
  - [x] Switch to visualization after creation
  - [x] Diagnostic logging for circuit operations

### Tasks - Photo Capture (Phase 0)
- [x] Photo upload interface
  - [x] File upload with preview
  - [x] Image metadata display
  - [x] Stub implementation for future CV
- [x] Roadmap documentation
  - [x] Phase 0: File handling (complete)
  - [x] Phase 1: Manual annotation (planned)
  - [x] Phase 2: Computer vision (planned)
- [x] Measurement source model
  - [x] Support for manual, serial, USB, BLE sources
  - [x] Workflow integration ready for hardware

**Status**: ✅ Complete (January 2026)

---

## 🚧 Phase 2 – Editor Básico (COMPLETED ✅)

**Goal**: Enable basic editing capabilities for the 3D layout.

### Tasks
- [x] Add panel for component management
  - [x] Component property editor (position, rotation, type, RefDes)
  - [x] Real-time editing with visual feedback
- [x] Implement grid snapping
  - [x] Visual grid overlay on PCB (5mm grid)
  - [x] Snap-to-grid for component placement
  - [x] Configurable via TransformControls
- [x] Add movement controls
  - [x] Drag components in X-Z plane (PCB surface)
  - [x] Rotation controls (90° increments)
  - [x] Transform gizmo using @react-three/drei's `<TransformControls>`
- [x] Save/load 3D layout
  - [x] Persist board layout in localStorage via AppState
  - [x] All changes automatically saved

**Status**: ✅ Complete (January 2026)

---

## 📋 Phase 3 – Nets & Medición (IN PROGRESS)

**Goal**: Visualize connections and integrate with measurement workflows.

### Tasks
- [x] Basic net visualization
  - [x] Render nets as lines between component pins
  - [x] Use different colors for different nets
- [x] Workflow integration with nets
  - [x] Link workflow steps to specific nets
  - [x] Link workflow steps to specific components
  - [x] Support for multiple measurement sources (manual, serial, USB, BLE)
- [x] 2D ↔ 3D synchronization
  - [x] Click component in 2D → highlights in 3D
  - [x] Click component in 3D → shows in logs
- [ ] Advanced net visualization (Future)
  - [ ] Pin-to-pin detailed mapping
  - [ ] Show net names and voltages in 3D
  - [ ] Visual indicators for connected/disconnected pins
- [ ] Workflow enhancements (Future)
  - [ ] Highlight components when test point is selected
  - [ ] Center camera on selected component
  - [ ] Animate camera transitions
  - [ ] Show measurement annotations in 3D space
- [ ] Diagnostic annotations (Future)
  - [ ] Add floating labels/sprites for measurement values
  - [ ] Color-code components based on diagnostic status
  - [ ] Display warnings/errors directly on 3D components

**Status**: 🟡 Partially Complete (January 2026)
**Target**: Q2 2026 for advanced features

---

## 🔄 Phase 4 – Import/Export

**Goal**: Enable interoperability with industry-standard PCB design tools.

### Tasks
- [ ] Export capabilities
  - [ ] JSON format (native format)
  - [ ] 3D model export (GLTF/GLB)
  - [ ] SVG top-view export
  - [ ] Component placement list (CSV)
- [ ] Import from external sources
  - [ ] JSON board configuration
  - [ ] Simplified KiCad import (component positions)
  - [ ] Basic Gerber file parsing (board outline only)
  - [ ] Generic CSV format (RefDes, X, Y, Rotation)
- [ ] Documentation generation
  - [ ] 3D screenshots from multiple angles
  - [ ] Assembly instructions with 3D views
  - [ ] BOM with 3D component references

**Target**: Q3 2026

---

## 📚 Documentation & Examples (COMPLETED ✅)

**Goal**: Improve project documentation and provide examples for users.

### Tasks
- [x] Examples directory
  - [x] LED regulator example circuit
  - [x] Complete AppState JSON with all features
  - [x] 3D board layout included
- [x] Demo mode
  - [x] `npm run demo` script to load example
  - [x] Easy way for users to try the app
- [x] Contributing guidelines
  - [x] CONTRIBUTING.md with clear guidelines
  - [x] Instructions for issues, PRs, and development
  - [x] Code style and architecture guidelines
- [x] README enhancements
  - [x] Updated feature descriptions
  - [x] New usage sections for all features
  - [x] Examples section
  - [x] Updated project structure
  - [x] Future roadmap integration

**Status**: ✅ Complete (January 2026)

---

## 🎯 Phase 5 – Advanced Features (FUTURE)

**Goal**: Add sophisticated visualization and analysis capabilities.

### Potential Features
- [ ] Component library management
  - [ ] Custom 3D models for common components
  - [ ] Component footprint library
  - [ ] Visual component browser
- [ ] Advanced visualization
  - [ ] Heatmaps (power dissipation, signal integrity)
  - [ ] Layer visualization (top, bottom, internal layers)
  - [ ] Transparent PCB to see both sides
- [ ] Simulation integration
  - [ ] Real-time signal visualization in 3D
  - [ ] Current flow animation
  - [ ] Voltage level color coding
- [ ] Collaborative features
  - [ ] Share 3D views with team
  - [ ] Annotations and comments in 3D space
  - [ ] Version control for layouts
- [ ] AR/VR support
  - [ ] WebXR integration for immersive viewing
  - [ ] Overlay 3D model on physical board (AR)

**Target**: 2027+

---

## Technology Stack

- **3D Rendering**: three.js
- **React Integration**: @react-three/fiber
- **3D Utilities**: @react-three/drei (OrbitControls, TransformControls, Text)
- **State Management**: React hooks + localStorage
- **Export**: JSON, GLTF/GLB (future)

---

## Success Metrics

- **Phase 1**: Users can view and interact with 3D board representation
- **Phase 2**: Users can design basic layouts without external tools
- **Phase 3**: Measurement workflows seamlessly integrate with 3D view
- **Phase 4**: Users can import/export to standard formats
- **Phase 5**: Advanced users can perform complex analysis in 3D

---

**Last Updated**: January 2026

*This roadmap is subject to change based on user feedback and project priorities.*
