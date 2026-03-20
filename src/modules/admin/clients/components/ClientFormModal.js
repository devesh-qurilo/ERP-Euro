// ClientFormModal.js
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import {
  categoryList,
  categoryCreate,
  categoryDelete,
  subCategoryList,
  subCategoryCreate,
  subCategoryDelete,
} from '../store/actions';
import {
  selectCategories,
  selectCategoriesBusy,
  selectSubCategories,
  selectSubCategoriesBusy,
} from '../store/selectors'; // update path if selectors are elsewhere

import { pickImageOrDoc } from './fileHelpers';

export default function ClientFormModal({
  visible,
  onClose,
  onSubmit,
  initial,
}) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoriesBusy);
  const subCategories = useSelector(selectSubCategories);
  const subCategoriesLoading = useSelector(selectSubCategoriesBusy);

  const blank = {
    name: '',
    email: '',
    mobile: '',
    country: '',
    gender: '',
    category: '',
    subCategory: '',
    language: '',
    receiveEmail: false,
    skype: '',
    linkedIn: '',
    twitter: '',
    facebook: '',
    company: {
      companyName: '',
      website: '',
      officePhone: '',
      taxName: '',
      gstVatNo: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      shippingAddress: '',
    },
  };
  const [client, setClient] = useState(blank);
  const [profilePicture, setProfile] = useState(null);
  const [companyLogo, setLogo] = useState(null);

  // local modals for manage category/subcategory
  const [manageCategoryOpen, setManageCategoryOpen] = useState(false);
  const [manageSubCategoryOpen, setManageSubCategoryOpen] = useState(false);

  // inputs for new category/subcategory
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');

  useEffect(() => {
    if (visible) {
      // load categories & subcategories when modal opens
      dispatch(categoryList());
      dispatch(subCategoryList());

      if (initial)
        setClient({
          ...blank,
          ...initial,
          company: { ...blank.company, ...(initial.company || {}) },
        });
      else setClient(blank);
      setProfile(null);
      setLogo(null);
    }
  }, [visible, initial, dispatch]);

  const F = (k, v) => setClient(p => ({ ...p, [k]: v }));
  const FC = (k, v) =>
    setClient(p => ({ ...p, company: { ...(p.company || {}), [k]: v } }));

  /* static lists for country/language/gender — you can extend these */
  const countries = [
    'country',
    'United States',
    'United Kingdom',
    'UAE',
    'Other',
  ];
  const languages = ['English', 'French', 'Spanish', 'Other'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  /* Category helpers */
  async function handleAddCategory() {
    if (!newCategoryName.trim()) return Alert.alert('Enter category name');
    dispatch(categoryCreate({ categoryName: newCategoryName.trim() }));
    setNewCategoryName('');
  }
  async function handleDeleteCategory(id) {
    Alert.alert('Delete', 'Delete this category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(categoryDelete(id)),
      },
    ]);
  }

  /* Subcategory helpers */
  async function handleAddSubCategory() {
    if (!newSubCategoryName.trim())
      return Alert.alert('Enter sub category name');
    dispatch(subCategoryCreate({ subCategoryName: newSubCategoryName.trim() }));
    setNewSubCategoryName('');
  }
  async function handleDeleteSubCategory(id) {
    Alert.alert('Delete', 'Delete this sub category?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(subCategoryDelete(id)),
      },
    ]);
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          backgroundColor: '#fff',
          marginTop: 30,
          paddingBottom: 40,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            {initial ? 'Edit' : 'Add'} Client
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>

        {/* core fields */}
        {[
          ['name', 'Full Name', 'text'],
          ['email', 'Email', 'text'],
          ['mobile', 'Mobile', 'text'],
        ].map(([k, label]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={String(client[k] ?? '')}
              onChangeText={t => F(k, t)}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                padding: 10,
              }}
            />
          </View>
        ))}

        {/* Compact row: Category + +button, SubCategory + +button */}
        <View style={{ flexDirection: 'column', gap: 8 }}>
          <View style={{ flex: 1, marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>Category</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                overflow: 'hidden',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Picker
                  selectedValue={client.category || ''}
                  onValueChange={val => F('category', val)}
                  itemStyle={{ height: 60 }}
                  style={{
                    width: '90%',
                    color: '#111',
                  }}
                  dropdownIconColor="#111"
                >
                  <Picker.Item
                    label="Select category"
                    value=""
                    style={{
                      width: '90%',
                      color: '#111',
                    }}
                    dropdownIconColor="#111"
                  />
                  {(categories || []).map(cat => (
                    <Picker.Item
                      key={cat.id}
                      label={cat.categoryName}
                      value={cat.categoryName}
                    />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                onPress={() => setManageCategoryOpen(true)}
                style={{
                  padding: 10,
                  borderLeftWidth: 1,
                  borderLeftColor: '#e5e7eb',
                }}
              >
                <Icon name="plus" size={18} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 1, marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>Sub Category</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                overflow: 'hidden',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <Picker
                  selectedValue={client.subCategory || ''}
                  onValueChange={val => F('subCategory', val)}
                  itemStyle={{ height: 60 }}
                >
                  <Picker.Item label="Select sub category" value="" />
                  {(subCategories || []).map(sc => (
                    <Picker.Item
                      key={sc.id}
                      label={sc.subCategoryName}
                      value={sc.subCategoryName}
                    />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                onPress={() => setManageSubCategoryOpen(true)}
                style={{
                  padding: 10,
                  borderLeftWidth: 1,
                  borderLeftColor: '#e5e7eb',
                }}
              >
                <Icon name="plus" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* other dropdowns: country, language, gender */}
        <View style={{ flexDirection: 'column', gap: 8 }}>
          <View style={{ flex: 1, marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>Country</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <Picker
                selectedValue={client.country || ''}
                onValueChange={v => F('country', v)}
                itemStyle={{ height: 60 }}
              >
                <Picker.Item label="Select country" value="" />
                {countries.map(c => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{ flex: 1, marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>Language</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <Picker
                selectedValue={client.language || ''}
                onValueChange={v => F('language', v)}
                itemStyle={{ height: 60 }}
              >
                <Picker.Item label="Select language" value="" />
                {languages.map(l => (
                  <Picker.Item key={l} label={l} value={l} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{ flex: 1, marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>Gender</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <Picker
                selectedValue={client.gender || ''}
                onValueChange={v => F('gender', v)}
                itemStyle={{ height: 60 }}
              >
                <Picker.Item label="Select gender" value="" />
                {genders.map(g => (
                  <Picker.Item key={g} label={g} value={g} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* rest of simple text inputs */}
        {[
          ['language', 'Language (text)'],
          ['skype', 'Skype'],
          ['linkedIn', 'LinkedIn'],
          ['twitter', 'Twitter'],
          ['facebook', 'Facebook'],
        ].map(([k, label]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={String(client[k] ?? '')}
              onChangeText={t => F(k, t)}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                padding: 10,
              }}
            />
          </View>
        ))}

        <Text style={{ fontWeight: '700', marginTop: 12, marginBottom: 8 }}>
          Company
        </Text>
        {[
          ['companyName', 'Company Name'],
          ['website', 'Website'],
          ['officePhone', 'Office Phone'],
          ['taxName', 'Tax Name'],
          ['gstVatNo', 'GST/VAT No'],
          ['address', 'Address'],
          ['city', 'City'],
          ['state', 'State'],
          ['postalCode', 'Postal Code'],
          ['shippingAddress', 'Shipping Address'],
        ].map(([k, label]) => (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={String(client.company?.[k] ?? '')}
              onChangeText={t => FC(k, t)}
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 10,
                padding: 10,
              }}
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={async () => setProfile(await pickImageOrDoc())}
          style={{
            backgroundColor: '#2b6bd8',
            padding: 12,
            borderRadius: 10,
            marginTop: 6,
          }}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Choose Profile Picture (optional)
          </Text>
        </TouchableOpacity>
        {profilePicture ? (
          <Text style={{ marginTop: 6 }}>Attached: {profilePicture.name}</Text>
        ) : null}

        <TouchableOpacity
          onPress={async () => setLogo(await pickImageOrDoc())}
          style={{
            backgroundColor: '#2b6bd8',
            padding: 12,
            borderRadius: 10,
            marginTop: 6,
          }}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            Choose Company Logo (optional)
          </Text>
        </TouchableOpacity>
        {companyLogo ? (
          <Text style={{ marginTop: 6 }}>Attached: {companyLogo.name}</Text>
        ) : null}

        <TouchableOpacity
          onPress={() => onSubmit({ ...client, profilePicture, companyLogo })}
          style={{
            backgroundColor: '#2b6bd8',
            padding: 14,
            borderRadius: 10,
            marginTop: 16,
          }}
        >
          <Text
            style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}
          >
            {initial ? 'Save' : 'Create'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Manage Category Modal */}
      <Modal
        visible={manageCategoryOpen}
        animationType="slide"
        onRequestClose={() => setManageCategoryOpen(false)}
      >
        <View
          style={{
            padding: 16,
            flex: 1,
            marginTop: 40,
            backgroundColor: '#fff',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              Manage Categories
            </Text>
            <TouchableOpacity onPress={() => setManageCategoryOpen(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ marginBottom: 6 }}>Add new category</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="Category name"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  padding: 8,
                }}
              />
              <TouchableOpacity
                onPress={handleAddCategory}
                style={{
                  padding: 10,
                  backgroundColor: '#111827',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 16, flex: 1 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Existing</Text>
            {(categoriesLoading ? [] : categories || []).map(cat => (
              <View
                key={cat.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                }}
              >
                <Text>{cat.categoryName}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setClient(prev => ({
                        ...prev,
                        category: cat.categoryName,
                      }));
                    }}
                  >
                    <Text style={{ color: '#2563eb' }}>Use</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(cat.id)}
                  >
                    <Text style={{ color: '#dc2626' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Modal>

      {/* Manage SubCategory Modal */}
      <Modal
        visible={manageSubCategoryOpen}
        animationType="slide"
        onRequestClose={() => setManageSubCategoryOpen(false)}
      >
        <View
          style={{
            padding: 16,
            flex: 1,
            marginTop: 40,
            backgroundColor: '#fff',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              Manage Sub Categories
            </Text>
            <TouchableOpacity onPress={() => setManageSubCategoryOpen(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ marginBottom: 6 }}>Add new sub category</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                value={newSubCategoryName}
                onChangeText={setNewSubCategoryName}
                placeholder="Sub category name"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  padding: 8,
                }}
              />
              <TouchableOpacity
                onPress={handleAddSubCategory}
                style={{
                  padding: 10,
                  backgroundColor: '#111827',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginTop: 16, flex: 1 }}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Existing</Text>
            {(subCategoriesLoading ? [] : subCategories || []).map(sc => (
              <View
                key={sc.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                }}
              >
                <Text>{sc.subCategoryName}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setClient(prev => ({
                        ...prev,
                        subCategory: sc.subCategoryName,
                      }));
                    }}
                  >
                    <Text style={{ color: '#2563eb' }}>Use</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteSubCategory(sc.id)}
                  >
                    <Text style={{ color: '#dc2626' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
