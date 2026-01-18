# Cognitive Diagnostics: The Semantic Layer for Electronics

> 📖 **Part of the complete cognitive ecosystem** - see [COGNITIVE_ECOSYSTEM.md](./COGNITIVE_ECOSYSTEM.md) for the integrated vision.

## What is This?

Traditional electronic tools give you measurements. **Cognitive Diagnostics gives you understanding.**

This is the missing piece in electronic debugging - the **causal reasoning layer** that connects circuit states to functional outcomes.

## The Problem

When you measure a circuit, you get numbers:
- VCC = 1.5V
- LED forward voltage = 0.3V
- Current = 0mA

But what do they **mean**? What will **fail**? **Why** will it fail?

This knowledge lives in the heads of senior engineers but has never been captured in software.

## The Solution

### Causal Rules

Define relationships like a diagnostic expert would:

```
IF: VCC voltage is below 2.0V
THEN: LED will not illuminate
WHY: Insufficient voltage to overcome LED forward voltage drop 
     (typically 1.8-2.0V for red LEDs) plus the voltage drop 
     across the current limiting resistor
```

### Automatic Evaluation

The system continuously evaluates rules against:
- Real-time net voltages
- Measurement results
- Component states
- Signal presence/absence

### Live Diagnosis

When conditions are met, rules "trigger":
- Displays in "Active Diagnoses" section
- Shows severity (critical/warning/info)
- Explains the causal chain
- Highlights affected nets and components

## Why This Matters

### For Technicians
No more guessing. The system tells you what's wrong and why.

### For Engineers
Capture expert knowledge once, use it forever.

### For Education
Students learn the "why" behind circuit behavior, not just measurements.

### For Industry
- Faster diagnostics
- Consistent results
- Reduced training time
- Documented expertise

## The Philosophical Shift

Traditional debugging:
```
Measure → Interpret → Diagnose → Fix
```

Cognitive debugging:
```
Measure → Automatic Interpretation → Predicted Consequences → Guided Fix
```

## Examples from Real Circuits

### Power Supply Failure
```
IF: Voltage regulator output < 4.75V
THEN: Microcontroller will not boot reliably
WHY: MCU requires minimum 4.75V for stable operation. 
     Below this, brown-out reset will trigger intermittently.
```

### Oscillator Failure
```
IF: Crystal load capacitor is open (disconnected)
THEN: Oscillator will not start
WHY: Load capacitors are required to match the crystal's 
     specified load capacitance. Without them, the crystal 
     cannot sustain oscillation.
```

### Filtering Failure
```
IF: Decoupling capacitor ESR > 1Ω
THEN: Power rail will have excessive noise
WHY: High ESR limits the capacitor's ability to supply 
     high-frequency transient currents, causing voltage sag 
     during switching events.
```

### Thermal Runaway
```
IF: Current limiting resistor is absent OR shorted
THEN: LED will experience thermal runaway and burn out
WHY: LEDs have negative temperature coefficient - as they heat,
     forward voltage drops, increasing current, increasing heat.
     Without current limiting, this creates positive feedback.
```

## The Architecture

### Data Model
- **Conditions**: Observable circuit states (voltages, currents, states)
- **Consequences**: What fails (oscillation stops, rail drops, signal lost)
- **Rules**: The causal link between conditions and consequences
- **Explanations**: The "why" - the physics and EE theory

### Evaluation Engine
- Condition checking (>, <, =, between, present, absent)
- Rule triggering (all conditions must be true)
- Consequence prediction
- Affected component identification

### User Interface
- Rule creation and editing
- Live status display
- Active diagnosis alerts
- Severity indicators
- Detailed explanations

## Future Enhancements

1. **Rule Library**: Pre-built rules for common circuits
2. **AI Suggestions**: ML-based rule generation from circuit topology
3. **Guided Repair**: Step-by-step fix procedures
4. **Historical Analysis**: Learn from past failures
5. **Collaborative Knowledge**: Share rules with the community

## The Vision

> **In software, we have debuggers with breakpoints and stack traces.**
> **In electronics, we have multimeters and intuition.**
> **Cognitive Diagnostics bridges this gap.**

This is not just a feature. It's a **new category** of electronic tools:

**Cognitive Electronic Debugging** - where circuits become understandable systems, not mysterious boxes.

---

*Built with ❤️ for the electronics community*
