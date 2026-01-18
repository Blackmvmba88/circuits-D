# Cognitive Flow Circuit: Technical Narrative System

> **"The circuit tells you numbers. The system tells you what they mean."**

## Overview

The Cognitive Flow Circuit closes the loop between measurement, analysis, and understanding. Instead of just seeing "3.2V", you get:

> *"This rail should be 5V ±5%. Observed: 3.2V. Probable cause: component saturation or LED current limiting resistor absent."*

This is the missing piece in electronic debugging — the **technical narrative** that transforms raw data into engineering conclusions.

## The Three Pillars

### 1. Expected vs. Observed Comparison

Every measurement is automatically compared against its specification:

```typescript
Expected: 5.0V ± 5% (4.75V - 5.25V)
Observed: 3.2V
Result: FAIL (36% below nominal)
```

The system parses tolerance specifications in multiple formats:
- Percentage: `5V ± 5%`
- Absolute: `5V ± 0.25V`
- Range: `4.75V - 5.25V`
- Simple: `5V` (defaults to ±5%)

### 2. Decision Logic

Based on the comparison, the system makes an engineering decision:

- **PASS**: Value within tolerance
- **WARNING**: Value outside tolerance but within 50% deviation
- **FAIL**: Value significantly outside specification (>50% deviation)
- **UNKNOWN**: Insufficient data for decision

This isn't just pass/fail — it's graduated assessment that mirrors real engineering judgment.

### 3. Technical Narrative Generation

The system generates a complete technical narrative for each measurement:

```
LED Circuit Verification - Step 2: Expected 1.85V ± 8.1% at D1 (N1). 
Observed: 0.3V. Result: FAIL. 
Probable cause: LED is reverse-biased and will not illuminate.
```

Each narrative includes:
- **Full narrative**: Complete technical statement
- **Probable cause**: Why the deviation occurred (linked to diagnostic rules)
- **Technical explanation**: The physics and engineering principles
- **Recommended actions**: Specific next steps to diagnose or fix

## Integration with Diagnostic Rules

Technical narratives are powered by the **Cognitive Rule Library** — 50+ expert rules that encode how test engineers think:

### Example Rule: Low Supply Voltage

```typescript
IF: VCC voltage < 2.0V
THEN: LED will not illuminate
WHY: Insufficient voltage to overcome LED forward voltage drop 
     (typically 1.8-2.0V for red LEDs) plus the voltage drop 
     across the current limiting resistor.
```

When measurements trigger these rules, the narrative system:
1. Identifies which rules are active
2. Extracts probable causes from consequences
3. Links affected nets and components
4. Generates context-specific recommended actions

## The Cognitive Rule Library

The library contains **57 expert diagnostic rules** across 8 categories:

### Power Rules (5 rules)
- Rail voltage below minimum
- Excessive rail ripple
- Voltage regulator saturation
- Reverse polarity protection
- Inrush current limiting

### Signal Rules (5 rules)
- Signal missing at output
- Signal attenuation excessive
- DC bias point incorrect
- AC coupling capacitor open
- Input impedance mismatch

### Timing Rules (5 rules)
- Oscillator not starting
- Clock signal absent
- Clock jitter excessive
- PLL not locking
- Propagation delay excessive

### Component Rules (9 rules)
- LED no current flow
- LED thermal runaway
- Resistor value incorrect
- Capacitor ESR high
- Capacitor leakage high
- Diode forward drop excessive
- Transistor saturation failure
- Op-amp output rail limited
- Voltage reference drift

### Filtering Rules (5 rules)
- Decoupling capacitor missing
- Ground bounce present
- EMI filter ineffective
- Common mode noise high
- Power supply rejection inadequate

### Thermal Rules (4 rules)
- Component overheating
- Thermal runaway in linear regulator
- Thermal protection active
- Temperature coefficient effect

### Digital Rules (5 rules)
- Logic level threshold violation
- Floating input
- Bus contention
- Setup/hold time violation
- Fan-out exceeded

### Protection Rules (3 rules)
- Overcurrent protection triggered
- ESD clamp conducting
- Overvoltage protection active

## Hardware Integration Layer

The system supports **real measurement sources**, not just manual entry:

### Supported Interfaces

1. **Serial (Arduino/Teensy)**
   - Uses Web Serial API
   - Command protocol: `READ:VOLTAGE:netId\n`
   - Response: `VOLTAGE:3.14\n`
   - Configurable baud rate (default 9600)

2. **BLE (ESP32 ADC)**
   - Uses Web Bluetooth API
   - Write command, read response via characteristics
   - 4-byte float format (little-endian)
   - Supports multiple measurement types

3. **USB-VCP (Multimeters)**
   - Virtual COM Port communication
   - Same protocol as serial
   - Automatic device enumeration

4. **Manual (Backward Compatible)**
   - User enters values
   - Same workflow as before
   - No hardware required

### Usage Example

```typescript
// Create hardware interface
const hardware = createHardwareInterface('serial');

// Connect with configuration
await hardware.connect({
  source: 'serial',
  baudRate: 115200
});

// Read voltage from a net
const voltage = await hardware.readVoltage('led-vcc');
// Returns: 5.02 (volts)

// Disconnect when done
await hardware.disconnect();
```

### Arduino Example Code

```cpp
// Simple Arduino firmware for voltage measurement
void setup() {
  Serial.begin(9600);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    
    if (cmd.startsWith("READ:VOLTAGE:")) {
      String netId = cmd.substring(13);
      float voltage = analogRead(A0) * (5.0 / 1023.0);
      Serial.print("VOLTAGE:");
      Serial.println(voltage, 2);
    }
  }
}
```

## Workflow Integration

The technical narrative system integrates seamlessly with measurement workflows:

### 1. Manual Measurement
```typescript
// User completes measurement step
onStepUpdate(workflowId, stepId, {
  status: 'complete',
  actualValue: '3.2V'
});

// System automatically generates narrative
const narrative = generateMeasurementNarrative({
  circuit,
  measurement: step,
  net: circuit.nets.find(n => n.id === step.netId),
  triggeredRules: evaluateAllRules(...)
});
```

### 2. Hardware Measurement
```typescript
// Connect to hardware
await hardware.connect({ source: 'serial', baudRate: 9600 });

// Automated measurement
for (const step of workflow.steps) {
  const value = await hardware.readVoltage(step.netId);
  
  // Update step with measured value
  onStepUpdate(workflowId, step.id, {
    status: 'complete',
    actualValue: `${value}V`
  });
  
  // Narrative generated automatically
}

// Disconnect
await hardware.disconnect();
```

## UI Components

### Technical Narratives Panel

Displays all generated narratives with:
- **Statistics**: Pass/Warning/Fail counts
- **Expandable cards**: Click to see full details
- **Color coding**: Visual indication of severity
- **Recommended actions**: Actionable next steps

### Rule Library Browser

Browse and apply rules from the cognitive library:
- **57 pre-built rules** ready to use
- **Search and filter** by category
- **Apply to circuit** with one click
- **Full explanations** for each rule

### Enhanced Measurement Workflows

Workflows now support:
- **Hardware source selection**: Choose manual/serial/usb/ble
- **Automatic narrative generation**: After each measurement
- **Real-time rule evaluation**: Continuous diagnosis
- **Net and component linking**: Full traceability

## Example: LED Circuit Diagnosis

### Scenario
You're testing an LED circuit. VCC should be 5V, but the LED isn't lighting.

### Measurement
```
Step 1: Verify Supply Voltage
Expected: 5.0V ± 0.1V
Observed: 4.98V
Result: PASS ✓
```

### Narrative
> *"Verify Supply Voltage: Expected 5V ± 2% at VCC. Observed: 4.98V. Result: PASS. Nominal operation."*

```
Step 2: Check LED Forward Voltage  
Expected: 1.7V - 2.0V
Observed: 0.3V
Result: FAIL ✗
```

### Narrative with Diagnosis
> *"Check LED Forward Voltage: Expected 1.85V ± 8.1% at D1 (N1). Observed: 0.3V. Result: FAIL. Probable cause: LED is reverse-biased and will not illuminate. When an LED is connected backwards (cathode to positive, anode to ground), it acts as an open circuit in forward bias conditions. The measured voltage across it will be approximately equal to VCC minus the small voltage drop across the current-limiting resistor due to leakage current."*

### Recommended Actions
1. Check LED polarity - ensure anode (long lead/flat side) connects to positive
2. Verify LED is not damaged or shorted
3. Measure resistance across LED out of circuit to confirm functionality

## Architecture

```
Measurement → Parsing → Comparison → Rule Evaluation → Narrative Generation
     ↓           ↓           ↓              ↓                    ↓
  Hardware   Tolerance   Decision     Consequence         Full Technical
   Source     Calc       Logic        Prediction            Narrative
```

### Key Files

- **`utils/narrativeGenerator.ts`**: Core narrative generation engine
- **`utils/hardwareInterface.ts`**: Hardware abstraction layer
- **`utils/ruleLibrary.ts`**: 57 expert diagnostic rules
- **`utils/diagnosticEngine.ts`**: Rule evaluation engine
- **`components/TechnicalNarrativesPanel.tsx`**: Narrative display UI
- **`components/RuleLibraryBrowser.tsx`**: Rule library browser UI

## Benefits

### For Technicians
- **Guided troubleshooting**: System suggests probable causes
- **Actionable insights**: Specific next steps, not just data
- **Learning tool**: Explanations teach why failures occur

### For Engineers
- **Faster diagnosis**: Automated causal reasoning
- **Consistent results**: Same analysis every time
- **Knowledge capture**: Expert thinking encoded in rules

### For Education
- **Learn by doing**: Students see cause-effect relationships
- **Instant feedback**: Understand what measurements mean
- **Build intuition**: Develop engineering judgment

### For Industry
- **Reduced training time**: Junior techs think like seniors
- **Documented process**: Repeatable diagnostic methodology
- **Quality assurance**: Consistent evaluation standards

## Future Enhancements

### Phase 1 (Current)
- ✅ Technical narrative generation
- ✅ Hardware interface abstraction
- ✅ 57-rule cognitive library
- ✅ Expected vs. observed comparison
- ✅ Automated decision logic

### Phase 2 (Planned)
- [ ] Machine learning rule suggestions
- [ ] Historical trend analysis
- [ ] Waveform capture and analysis
- [ ] Multi-channel simultaneous measurement
- [ ] Advanced hardware protocols (I2C, SPI, CAN)

### Phase 3 (Future)
- [ ] Collaborative rule sharing
- [ ] Custom rule templates
- [ ] Advanced statistical analysis
- [ ] Integration with simulation tools
- [ ] Mobile hardware interface apps

## Conclusion

The Cognitive Flow Circuit transforms circuits-D from a measurement tool into a **cognitive engineering assistant**. It doesn't just show you what's wrong — it explains why, predicts consequences, and guides you to solutions.

This is the missing piece in electronic debugging. This is how engineers should work with circuits.

---

*"De átomo → a mente → a gusto. Sin fracturas. Sin mutilaciones. Un organismo completo."*
