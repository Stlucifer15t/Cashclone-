
import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, commonStyles } from '../../styles/commonStyles';
import Button from '../../components/Button';
import { useBank } from '../../context/BankContext';

export default function Profile() {
  const { state, updateProfile, updateBankInfo } = useBank();
  const [name, setName] = useState(state.profile.name);
  const [email, setEmail] = useState(state.profile.email);
  const [logo, setLogo] = useState<string | null>(state.profile.logoUri || null);
  const [accountNumber, setAccountNumber] = useState(state.bankInfo.accountNumber || '');
  const [routingNumber, setRoutingNumber] = useState(state.bankInfo.routingNumber || '');
  const [iban, setIban] = useState(state.bankInfo.iban || '');

  const pickLogo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access media library denied');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setLogo(uri);
      }
    } catch (e) {
      console.log('Error picking logo', e);
    }
  };

  const saveProfile = () => {
    updateProfile({ name, email, logoUri: logo || undefined });
  };

  const saveBank = () => {
    updateBankInfo({ accountNumber, routingNumber, iban });
  };

  return (
    <ScrollView style={commonStyles.scrollContainer} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={[commonStyles.content, { padding: 20 }]}>
        <Text style={commonStyles.title}>Profile</Text>

        <View style={[commonStyles.card, { alignItems: 'center' }]}>
          <View style={styles.logoWrap}>
            {logo ? (
              <Image source={{ uri: logo }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoInitials}>
                  {state.profile.name ? state.profile.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
          </View>
          <Button
            text="Upload Logo"
            onPress={pickLogo}
            style={styles.uploadBtn}
            textStyle={styles.uploadBtnText}
          />
          <View style={{ width: '100%', marginTop: 10 }}>
            <Text style={commonStyles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.mutedText}
              style={commonStyles.input}
            />
            <Text style={commonStyles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              placeholderTextColor={colors.mutedText}
              keyboardType="email-address"
              autoCapitalize="none"
              style={commonStyles.input}
            />
            <Button
              text="Save Profile"
              onPress={saveProfile}
              style={styles.saveBtn}
              textStyle={styles.saveBtnText}
            />
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={commonStyles.subtitle}>Bank Information</Text>
          <View style={commonStyles.card}>
            <Text style={commonStyles.label}>Account Number</Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="123456789"
              placeholderTextColor={colors.mutedText}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              style={commonStyles.input}
            />
            <Text style={commonStyles.label}>Routing Number</Text>
            <TextInput
              value={routingNumber}
              onChangeText={setRoutingNumber}
              placeholder="012345678"
              placeholderTextColor={colors.mutedText}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
              style={commonStyles.input}
            />
            <Text style={commonStyles.label}>IBAN</Text>
            <TextInput
              value={iban}
              onChangeText={setIban}
              placeholder="DE89 3704 0044 0532 0130 00"
              placeholderTextColor={colors.mutedText}
              autoCapitalize="characters"
              style={commonStyles.input}
            />
            <Button
              text="Save Bank Info"
              onPress={saveBank}
              style={styles.saveBtnOutline}
              textStyle={styles.saveBtnOutlineText}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    flex: 1,
    backgroundColor: '#E8EEF9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitials: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.text,
  },
  uploadBtn: {
    marginTop: 10,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    width: 160,
  },
  uploadBtnText: {
    color: colors.text,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '800',
  },
  saveBtnOutline: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
  },
  saveBtnOutlineText: {
    color: colors.text,
    fontWeight: '800',
  },
});
