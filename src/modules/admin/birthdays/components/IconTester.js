// src/dev/IconTester.js
import React, { Component, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import the icon families (you have these in node_modules)
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

// ErrorBoundary to catch render errors for individual icon renders
class IconErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.warn('Icon render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={[styles.iconWrap, styles.iconError]}>
          <Text style={styles.errEmoji}>⚠️</Text>
          <Text style={styles.errText} numberOfLines={2}>
            {this.props.label} failed
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// A small component to render an icon with label and tap handler
function IconTile({
  label,
  IconComponent,
  name,
  size = 28,
  color = '#0f172a',
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => onPress?.({ label, name })}
      activeOpacity={0.8}
    >
      <IconErrorBoundary label={label}>
        <View style={styles.iconWrap}>
          <IconComponent name={name} size={size} color={color} />
        </View>
      </IconErrorBoundary>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
      <Text style={styles.glyph}>{name}</Text>
    </TouchableOpacity>
  );
}

// Main tester screen
export default function IconTester() {
  const [preview, setPreview] = useState(null);

  const families = [
    { label: 'AntDesign', Comp: AntDesign, name: 'smileo' },
    { label: 'Entypo', Comp: Entypo, name: 'emoji-happy' },
    { label: 'EvilIcons', Comp: EvilIcons, name: 'user' },
    { label: 'Feather', Comp: Feather, name: 'user' },
    { label: 'FontAwesome', Comp: FontAwesome, name: 'user' },
    { label: 'FontAwesome5', Comp: FontAwesome5, name: 'user' },
    { label: 'Fontisto', Comp: Fontisto, name: 'person' },
    { label: 'Foundation', Comp: Foundation, name: 'male' },
    { label: 'Ionicons', Comp: Ionicons, name: 'person' },
    {
      label: 'MaterialCommunityIcons',
      Comp: MaterialCommunityIcons,
      name: 'cake',
    },
    { label: 'MaterialIcons', Comp: MaterialIcons, name: 'cake' },
    { label: 'Octicons', Comp: Octicons, name: 'person' },
    { label: 'SimpleLineIcons', Comp: SimpleLineIcons, name: 'user' },
    { label: 'Zocial', Comp: Zocial, name: 'user' },
  ];

  const onTilePress = data => setPreview(data);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Icon Family Tester — New Architecture
        </Text>
        <Text style={styles.headerSubtitle}>
          Tap a tile to preview. If icon fails, you'll see a warning tile. Use
          this to identify which families work.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          {families.map(f => (
            <IconTile
              key={f.label}
              label={f.label}
              IconComponent={f.Comp}
              name={f.name}
              onPress={onTilePress}
            />
          ))}
        </View>
      </ScrollView>

      <Modal visible={!!preview} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{preview?.label}</Text>
            <View style={{ alignItems: 'center', marginVertical: 12 }}>
              {preview ? (
                // Render a larger preview using the same component (safe inside boundary)
                <IconErrorBoundary label={`preview-${preview.label}`}>
                  <View style={styles.previewIconWrap}>
                    {/* find the component from families */}
                    {(() => {
                      const fam = families.find(x => x.label === preview.label);
                      if (!fam) return <Text>Unknown</Text>;
                      const C = fam.Comp;
                      return (
                        <C name={preview.name} size={96} color="#06b6d4" />
                      );
                    })()}
                  </View>
                </IconErrorBoundary>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setPreview(null)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16, borderBottomWidth: 1, borderColor: '#e6eef8' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  headerSubtitle: { fontSize: 12, color: '#6b7280', marginTop: 6 },

  container: { padding: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },

  tile: {
    width: 120,
    margin: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewIconWrap: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  glyph: { marginTop: 4, fontSize: 10, color: '#6b7280' },

  iconError: { backgroundColor: '#fee2e2', borderRadius: 8 },
  errEmoji: { fontSize: 20 },
  errText: {
    color: '#7f1d1d',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  closeBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#06b6d4',
    borderRadius: 8,
  },
  closeText: { color: '#022027', fontWeight: '800' },
});
