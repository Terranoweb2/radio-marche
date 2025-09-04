# Audio Controls Documentation

## 🎵 Enhanced Audio Features

The radio player includes audio controls accessible through the menu button (three dots icon) in the header.

> **Note:** Due to CORS restrictions from the audio server, advanced features (equalizer, balance) are temporarily disabled. Only volume control is currently functional.

### 🎛️ **Audio Controls Menu**

Click the **⋮** (three dots) button in the top-right corner to access the audio controls panel.

### 🔊 **Volume Control**
- **Volume Slider**: Adjust audio level from 0% to 100%
- **Mute/Unmute Button**: Toggle audio on/off while preserving volume level
- **Visual Feedback**: Real-time percentage display
- **Independent Control**: Works separately from system volume

### ⚖️ **Balance Control (L/R)**
- **Stereo Balance**: Adjust left/right channel balance
- **Range**: Full left (-100%) to full right (+100%)
- **Center Position**: Balanced stereo output (0%)
- **Visual Feedback**: Shows current balance position

### 🎚️ **5-Band Equalizer**
- **Bass (60Hz)**: Low-frequency control
- **Low Mid (170Hz)**: Lower midrange frequencies
- **Mid (350Hz)**: Core midrange frequencies  
- **High Mid (1kHz)**: Upper midrange frequencies
- **Treble (3.5kHz+)**: High-frequency control
- **Range**: -12dB to +12dB per band
- **Real-time Adjustment**: Changes apply instantly

### 🎼 **Audio Presets**
Pre-configured equalizer settings for different music styles:

- **Default**: Flat response (0dB all bands)
- **Rock**: Enhanced bass and treble (+4/+5dB)
- **Pop**: Balanced with slight bass boost (+2dB)
- **Classical**: Enhanced mids and treble, reduced bass
- **Jazz**: Warm sound with enhanced bass and treble
- **Electronic**: Heavy bass and treble emphasis
- **Vocal**: Midrange focus for speech clarity

### 🔧 **Technical Implementation**

#### Web Audio API Integration
- **AudioContext**: Modern browser audio processing
- **BiquadFilter**: Professional-grade equalizer filters
- **GainNode**: Precise volume control
- **StereoPanner**: Accurate balance control
- **Real-time Processing**: Zero-latency audio manipulation

#### Filter Specifications
- **Low Shelf Filter**: Bass control (60Hz)
- **Peaking Filters**: Mid-range bands (170Hz, 350Hz, 1kHz, 3.5kHz)
- **High Shelf Filter**: Treble control (10kHz+)
- **Q Factor**: 1.0 for natural sound
- **Gain Range**: ±12dB for professional control

#### Browser Compatibility
- **Modern Browsers**: Full Web Audio API support
- **Fallback**: Basic volume control for older browsers
- **Error Handling**: Graceful degradation when Web Audio unavailable

### 🎨 **User Interface**
- **Dark Theme**: Consistent with app design
- **Mobile Responsive**: Touch-friendly controls
- **Visual Feedback**: Real-time value displays
- **Smooth Animations**: Enhanced user experience
- **Custom Sliders**: Purple accent color matching app theme

### 📱 **Mobile Optimization**
- **Touch Controls**: Optimized for finger interaction
- **Responsive Layout**: Adapts to screen size
- **Gesture Support**: Smooth slider interaction
- **Performance**: Efficient rendering on mobile devices

### 🔄 **State Management**
- **Persistent Settings**: Controls maintain state during playback
- **Real-time Updates**: Instant audio processing
- **Error Recovery**: Robust handling of audio context issues
- **Memory Management**: Proper cleanup on component unmount

### 🚀 **Performance Features**
- **Lazy Loading**: Audio context created only when needed
- **Efficient Processing**: Optimized filter chain
- **Memory Cleanup**: Proper resource disposal
- **Minimal Latency**: Real-time audio processing

### 🎯 **Usage Tips**
1. **Start Playback First**: Audio controls activate after starting the radio
2. **Experiment with Presets**: Try different styles for optimal sound
3. **Fine-tune with EQ**: Adjust individual bands for personal preference
4. **Use Balance**: Compensate for headphone/speaker imbalances
5. **Save Battery**: Lower volume reduces power consumption on mobile

### 🔧 **Troubleshooting**
- **No Audio**: Check volume and mute status
- **EQ Not Working**: Ensure modern browser with Web Audio support
- **Performance Issues**: Try disabling EQ on older devices
- **Balance Problems**: Reset balance to center (0%)

The audio controls provide professional-grade sound customization while maintaining the app's elegant design and mobile-first approach.
