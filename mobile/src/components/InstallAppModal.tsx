import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
  Linking
} from 'react-native';

interface InstallAppModalProps {
  visible: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ visible, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isApple);

      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handler);

      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert('To install on iOS:\n1. Tap the Share button (⎋) in Safari\n2. Select "Add to Home Screen" (⊞)');
    } else {
      // Fallback
      alert('To install on your phone:\n1. Open menu (⋮) in your mobile browser\n2. Tap "Install App" or "Add to Home screen"');
    }
  };

  const openApkReleases = () => {
    Linking.openURL('https://github.com/Pradyumna-jse/railways-/releases');
  };

  const appUrl = 'https://mobile-sigma-eight.vercel.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appUrl)}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.appHeaderInfo}>
              <View style={styles.appIconContainer}>
                <Text style={styles.appIconEmoji}>🚆</Text>
              </View>
              <View>
                <Text style={styles.title}>TurnWise Mobile App</Text>
                <Text style={styles.subtitle}>Install or Download for Android & iOS</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {isInstalled ? (
              <View style={styles.installedBox}>
                <Text style={styles.installedTitle}>✅ App Already Installed!</Text>
                <Text style={styles.installedText}>
                  TurnWise is running as an installed application on your device.
                </Text>
              </View>
            ) : (
              <>
                {/* Method 1: Instant Install / PWA */}
                <View style={styles.card}>
                  <Text style={styles.cardTag}>RECOMMENDED</Text>
                  <Text style={styles.cardTitle}>📲 1-Tap Mobile Install</Text>
                  <Text style={styles.cardDesc}>
                    Installs directly to your home screen with offline maps, full screen mode, and instant updates.
                  </Text>
                  <TouchableOpacity
                    style={styles.installBtn}
                    onPress={handleInstallClick}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.installBtnText}>
                      {isIOS ? 'Instructions for iPhone / iPad' : 'Install TurnWise Now'}
                    </Text>
                  </TouchableOpacity>
                  {isIOS && (
                    <View style={styles.iosTipBox}>
                      <Text style={styles.iosTipText}>
                        💡 Safari: Tap <Text style={{ fontWeight: 'bold' }}>Share (⎋)</Text> ➡️ tap <Text style={{ fontWeight: 'bold' }}>"Add to Home Screen" (⊞)</Text>
                      </Text>
                    </View>
                  )}
                </View>

                {/* Method 2: Download APK */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>🤖 Android APK File</Text>
                  <Text style={styles.cardDesc}>
                    Download the native standalone <Text style={{ fontWeight: 'bold' }}>TurnWise.apk</Text> directly from GitHub Releases to install offline.
                  </Text>
                  <TouchableOpacity
                    style={styles.apkBtn}
                    onPress={openApkReleases}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.apkBtnText}>📥 Download TurnWise.apk</Text>
                  </TouchableOpacity>
                </View>

                {/* Method 3: QR Code to scan with Phone */}
                <View style={styles.qrSection}>
                  <Text style={styles.qrTitle}>📷 Scan with Mobile Camera</Text>
                  <Text style={styles.qrDesc}>Open camera on your phone to launch and install TurnWise:</Text>
                  <View style={styles.qrImageWrapper}>
                    <Image
                      source={{ uri: qrUrl }}
                      style={styles.qrImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.urlText}>{appUrl}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  container: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F8FAFC'
  },
  appHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  appIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  appIconEmoji: {
    fontSize: 22
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A'
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '600'
  },
  body: {
    padding: 20,
    gap: 14
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative'
  },
  cardTag: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10
  },
  installBtn: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  installBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  },
  apkBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  apkBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  },
  iosTipBox: {
    marginTop: 8,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8
  },
  iosTipText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16
  },
  qrSection: {
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  qrTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2
  },
  qrDesc: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center'
  },
  qrImageWrapper: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  qrImage: {
    width: 140,
    height: 140
  },
  urlText: {
    marginTop: 6,
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600'
  },
  installedBox: {
    padding: 20,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center'
  },
  installedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 6
  },
  installedText: {
    fontSize: 13,
    color: '#15803D',
    textAlign: 'center'
  }
});
