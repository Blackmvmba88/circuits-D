// Hardware Interface Abstraction Layer
// Supports serial, USB, and BLE measurement sources for real hardware integration

import type { MeasurementSource } from '../types';

export interface HardwareConfig {
  source: MeasurementSource;
  deviceId?: string;
  baudRate?: number; // For serial
  serviceUUID?: string; // For BLE
  characteristicUUID?: string; // For BLE
}

export interface MeasurementReading {
  netId: string;
  value: number;
  unit: string;
  timestamp: Date;
  source: MeasurementSource;
}

export interface HardwareInterface {
  connect(config: HardwareConfig): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  readVoltage(netId: string): Promise<number | null>;
  readCurrent(netId: string): Promise<number | null>;
  readFrequency(netId: string): Promise<number | null>;
  getStatus(): string;
}

/**
 * Serial (Arduino/Teensy) Hardware Interface
 * Uses Web Serial API for browser-based serial communication
 */
export class SerialHardwareInterface implements HardwareInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private port: any = null; // SerialPort type not available in standard TypeScript
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private reader: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private writer: any = null;
  private connected = false;
  private config?: HardwareConfig;

  async connect(config: HardwareConfig): Promise<boolean> {
    this.config = config;
    
    // Check if Web Serial API is available
    if (!('serial' in navigator)) {
      console.error('Web Serial API not supported in this browser');
      return false;
    }

    try {
      // Request serial port from user
      // @ts-expect-error - Web Serial API not in TypeScript standard library
      this.port = await navigator.serial.requestPort();
      
      // Open the port
      await this.port.open({ 
        baudRate: config.baudRate || 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
      });

      this.reader = this.port.readable.getReader();
      this.writer = this.port.writable.getWriter();
      this.connected = true;
      
      console.log('Serial port connected successfully');
      return true;
    } catch (error) {
      console.error('Failed to connect to serial port:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.reader) {
      await this.reader.cancel();
      this.reader.releaseLock();
    }
    if (this.writer) {
      this.writer.releaseLock();
    }
    if (this.port) {
      await this.port.close();
    }
    this.connected = false;
    console.log('Serial port disconnected');
  }

  isConnected(): boolean {
    return this.connected;
  }

  async readVoltage(netId: string): Promise<number | null> {
    if (!this.connected || !this.writer || !this.reader) {
      console.error('Serial port not connected');
      return null;
    }

    try {
      // Send command to Arduino: "READ:VOLTAGE:netId\n"
      const command = `READ:VOLTAGE:${netId}\n`;
      const encoder = new TextEncoder();
      await this.writer.write(encoder.encode(command));

      // Read response with timeout
      const { value, done } = await Promise.race([
        this.reader.read(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Read timeout')), 5000)
        )
      ]) as { value: Uint8Array; done: boolean };

      if (done) {
        console.error('Serial port closed');
        return null;
      }

      // Parse response: expected format "VOLTAGE:3.14\n"
      const decoder = new TextDecoder();
      const response = decoder.decode(value);
      const match = response.match(/VOLTAGE:([\d.]+)/);
      
      if (match) {
        return parseFloat(match[1]);
      }

      console.error('Invalid voltage response:', response);
      return null;
    } catch (error) {
      console.error('Error reading voltage from serial:', error);
      return null;
    }
  }

  async readCurrent(netId: string): Promise<number | null> {
    // Similar to readVoltage but for current
    if (!this.connected || !this.writer || !this.reader) {
      return null;
    }

    try {
      const command = `READ:CURRENT:${netId}\n`;
      const encoder = new TextEncoder();
      await this.writer.write(encoder.encode(command));

      const { value, done } = await Promise.race([
        this.reader.read(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Read timeout')), 5000)
        )
      ]) as { value: Uint8Array; done: boolean };

      if (done) return null;

      const decoder = new TextDecoder();
      const response = decoder.decode(value);
      const match = response.match(/CURRENT:([\d.]+)/);
      
      return match ? parseFloat(match[1]) : null;
    } catch (error) {
      console.error('Error reading current from serial:', error);
      return null;
    }
  }

  async readFrequency(netId: string): Promise<number | null> {
    if (!this.connected || !this.writer || !this.reader) {
      return null;
    }

    try {
      const command = `READ:FREQUENCY:${netId}\n`;
      const encoder = new TextEncoder();
      await this.writer.write(encoder.encode(command));

      const { value, done } = await Promise.race([
        this.reader.read(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Read timeout')), 5000)
        )
      ]) as { value: Uint8Array; done: boolean };

      if (done) return null;

      const decoder = new TextDecoder();
      const response = decoder.decode(value);
      const match = response.match(/FREQUENCY:([\d.]+)/);
      
      return match ? parseFloat(match[1]) : null;
    } catch (error) {
      console.error('Error reading frequency from serial:', error);
      return null;
    }
  }

  getStatus(): string {
    return this.connected 
      ? `Connected via Serial (${this.config?.baudRate || 9600} baud)` 
      : 'Disconnected';
  }
}

/**
 * BLE (ESP32 ADC) Hardware Interface
 * Uses Web Bluetooth API for BLE communication
 */
export class BLEHardwareInterface implements HardwareInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private device: any = null; // BluetoothDevice type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private server: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private service: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private characteristic: any = null;
  private connected = false;

  async connect(config: HardwareConfig): Promise<boolean> {

    // Check if Web Bluetooth API is available
    if (!('bluetooth' in navigator)) {
      console.error('Web Bluetooth API not supported in this browser');
      return false;
    }

    try {
      // Request device
      // @ts-expect-error - Web Bluetooth API not in TypeScript standard library
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [config.serviceUUID || 'battery_service'] }],
        optionalServices: [config.serviceUUID || 'battery_service']
      });

      // Connect to GATT server
      this.server = await this.device.gatt.connect();
      
      // Get service
      this.service = await this.server.getPrimaryService(
        config.serviceUUID || 'battery_service'
      );
      
      // Get characteristic
      this.characteristic = await this.service.getCharacteristic(
        config.characteristicUUID || 'battery_level'
      );

      this.connected = true;
      console.log('BLE device connected successfully');
      return true;
    } catch (error) {
      console.error('Failed to connect to BLE device:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.connected = false;
    console.log('BLE device disconnected');
  }

  isConnected(): boolean {
    return this.connected;
  }

  async readVoltage(netId: string): Promise<number | null> {
    if (!this.connected || !this.characteristic) {
      console.error('BLE device not connected');
      return null;
    }

    try {
      // Write command to BLE characteristic
      const encoder = new TextEncoder();
      await this.characteristic.writeValue(
        encoder.encode(`V:${netId}`)
      );

      // Read response
      const value = await this.characteristic.readValue();
      
      // Parse as float (assuming ADC sends voltage as 4-byte float)
      const dataView = new DataView(value.buffer);
      return dataView.getFloat32(0, true); // little-endian
    } catch (error) {
      console.error('Error reading voltage from BLE:', error);
      return null;
    }
  }

  async readCurrent(netId: string): Promise<number | null> {
    if (!this.connected || !this.characteristic) {
      return null;
    }

    try {
      const encoder = new TextEncoder();
      await this.characteristic.writeValue(
        encoder.encode(`I:${netId}`)
      );

      const value = await this.characteristic.readValue();
      const dataView = new DataView(value.buffer);
      return dataView.getFloat32(0, true);
    } catch (error) {
      console.error('Error reading current from BLE:', error);
      return null;
    }
  }

  async readFrequency(netId: string): Promise<number | null> {
    if (!this.connected || !this.characteristic) {
      return null;
    }

    try {
      const encoder = new TextEncoder();
      await this.characteristic.writeValue(
        encoder.encode(`F:${netId}`)
      );

      const value = await this.characteristic.readValue();
      const dataView = new DataView(value.buffer);
      return dataView.getFloat32(0, true);
    } catch (error) {
      console.error('Error reading frequency from BLE:', error);
      return null;
    }
  }

  getStatus(): string {
    return this.connected 
      ? `Connected via BLE (${this.device?.name || 'Unknown Device'})` 
      : 'Disconnected';
  }
}

/**
 * USB-VCP (Virtual COM Port) Hardware Interface
 * For USB multimeters and instruments that appear as serial ports
 */
export class USBVCPHardwareInterface extends SerialHardwareInterface {
  // USB-VCP devices typically use serial communication
  // This class can add USB-specific initialization or protocol handling
  
  override getStatus(): string {
    return this.isConnected() 
      ? 'Connected via USB-VCP' 
      : 'Disconnected';
  }
}

/**
 * Manual measurement interface (for backward compatibility)
 */
export class ManualHardwareInterface implements HardwareInterface {
  private connected = false;

  async connect(): Promise<boolean> {
    this.connected = true;
    return true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async readVoltage(netId: string): Promise<number | null> {
    console.log(`Manual measurement requested for ${netId}`);
    return null; // Manual entry required
  }

  async readCurrent(netId: string): Promise<number | null> {
    console.log(`Manual measurement requested for ${netId}`);
    return null;
  }

  async readFrequency(netId: string): Promise<number | null> {
    console.log(`Manual measurement requested for ${netId}`);
    return null;
  }

  getStatus(): string {
    return 'Manual measurement mode';
  }
}

/**
 * Factory function to create appropriate hardware interface
 */
export function createHardwareInterface(source: MeasurementSource): HardwareInterface {
  switch (source) {
    case 'serial':
      return new SerialHardwareInterface();
    case 'ble':
      return new BLEHardwareInterface();
    case 'usb':
      return new USBVCPHardwareInterface();
    case 'manual':
    default:
      return new ManualHardwareInterface();
  }
}
