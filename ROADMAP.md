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

## 🚧 Phase 2 – Editor Básico (IN PROGRESS)

**Goal**: Enable basic editing capabilities for the 3D layout.

### Tasks
- [ ] Add panel for component management
  - [ ] Component library/palette (select from available components)
  - [ ] Add/remove components from board
  - [ ] Component property editor (position, rotation, type)
- [ ] Implement grid snapping
  - [ ] Visual grid overlay on PCB
  - [ ] Snap-to-grid for component placement
  - [ ] Configurable grid size
- [ ] Add movement controls
  - [ ] Drag components in X-Z plane (PCB surface)
  - [ ] Rotation controls (0°, 90°, 180°, 270°)
  - [ ] Transform gizmo using @react-three/drei's `<TransformControls>`
- [ ] Save/load 3D layout
  - [ ] Persist board layout in localStorage
  - [ ] Export/import board configuration as JSON

**Target**: Q1 2026

---

## 📋 Phase 3 – Nets & Medición

**Goal**: Visualize connections and integrate with measurement workflows.

### Tasks
- [ ] Pin-to-net mapping
  - [ ] Define pin positions on components
  - [ ] Associate pins with nets
  - [ ] Visual indicators for connected/disconnected pins
- [ ] Draw connection tracks
  - [ ] Render nets as lines between component pins
  - [ ] Use different colors for different nets
  - [ ] Show net names and voltages
- [ ] Workflow integration
  - [ ] Highlight components when test point is selected
  - [ ] Center camera on selected component
  - [ ] Animate camera transitions
  - [ ] Show measurement annotations in 3D space
- [ ] Diagnostic annotations
  - [ ] Add floating labels/sprites for measurement values
  - [ ] Color-code components based on diagnostic status
  - [ ] Display warnings/errors directly on 3D components

**Target**: Q2 2026

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
