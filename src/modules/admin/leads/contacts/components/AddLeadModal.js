// src/modules/admin/leads/contacts/components/AddLeadModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import {
  clientCategoryAPI,
  dealCategoryAPI,
  leadSourceAPI,
} from '../../../../../services/api';
import AddOptionModal from './AddOptionModal';
import OptionSelectWithAdd from './OptionSelectWithAdd';
import EmployeeSelect from './EmployeeSelect';
import MultiEmployeeSelect from './MultiEmployeeSelect';
import DateTimePicker from '@react-native-community/datetimepicker';

const Field = ({ label, required, children }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>
      {label} {required ? <Text style={{ color: '#ef4444' }}>*</Text> : null}
    </Text>
    {children}
  </View>
);

const ChoicePills = ({ options, value, onChange }) => {
  return (
    <View style={styles.pillsRow}>
      {options.map(opt => {
        const selected = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.pill, selected && styles.pillSelected]}
          >
            <Text
              style={[styles.pillText, selected && styles.pillTextSelected]}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const PIPELINES = ['Default Pipeline'];
const DEAL_STAGES = [
  'Generated',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Win',
  'Lost',
];
const DEAL_CATEGORIES = ['Sales', 'Development', 'Production'];

export default function AddLeadModal({
  visible,
  onClose,
  onSave,
  currentUserId, // e.g. EMP-009 for addedBy default
  defaultOwnerId, // e.g. EMP-010
  empOptions = [],
}) {
  const [form, setForm] = useState({
    // Lead basic
    name: '',
    email: '',
    mobileNumber: '',
    clientCategory: 'Corporate',
    leadSource: 'Website',

    // Owner info
    addedBy: currentUserId || '',
    leadOwner: defaultOwnerId || '',

    // Company details
    companyName: '',
    officialWebsite: '',
    officePhone: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    companyAddress: '',

    // Deal toggles + deal info
    createDeal: false,
    autoConvertToClient: false,
    deal: {
      title: '',
      pipeline: 'Default Pipeline',
      dealStage: 'Generated',
      dealCategory: 'Enterprise',
      value: '',
      expectedCloseDate: '',
      dealAgent: defaultOwnerId || '',
      dealWatchers: [defaultOwnerId || ''],
    },
  });

  const [leadSources, setLeadSources] = useState([]);
  const [categories, setCategories] = useState([]);

  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [dealCategories, setDealCategories] = useState([]);
  const [addDealCatOpen, setAddDealCatOpen] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [openWatchers, setOpenWatchers] = useState(false);

  // useEffect(() => {
  //   if (!visible) return;

  // }, [visible]);

  const [saving, setSaving] = useState(false);

  const valid = useMemo(
    () =>
      form.name.trim() &&
      (form.email.trim() || form.mobileNumber.trim()) &&
      form.leadOwner &&
      form.addedBy,
    [form],
  );

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));
  const setDeal = (k, v) =>
    setForm(s => ({ ...s, deal: { ...s.deal, [k]: v } }));

  useEffect(() => {
    if (!visible) return;

    leadSourceAPI.list().then(setLeadSources);
    clientCategoryAPI.list().then(setCategories);
    dealCategoryAPI.list().then(setDealCategories);
  }, [visible]);

  const submit = async () => {
    if (!valid || saving) return;
    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        clientCategory: form.clientCategory,
        leadSource: form.leadSource,
        addedBy: form.addedBy,
        leadOwner: form.leadOwner,
        createDeal: !!form.createDeal,
        autoConvertToClient: !!form.autoConvertToClient,

        // company details (NEW)
        companyName: form.companyName.trim(),
        officialWebsite: form.officialWebsite.trim(),
        officePhone: form.officePhone.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
        companyAddress: form.companyAddress.trim(),
      };

      if (form.createDeal) {
        payload.deal = {
          title: form.deal.title.trim(),
          pipeline: form.deal.pipeline,
          dealStage: form.deal.dealStage,
          dealCategory: form.deal.dealCategory,
          value: Number(form.deal.value || 0),
          expectedCloseDate: form.deal.expectedCloseDate,
          dealAgent: form.deal.dealAgent,
          dealWatchers: form.deal.dealWatchers?.filter(Boolean) || [],
        };
      }

      console.log('[LEADS][MODAL] will save ->', payload);
      // parent should dispatch createLeadRequest(payload) in onSave
      await onSave?.(payload);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Add Lead</Text>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 160 }}
            showsVerticalScrollIndicator={false}
          >
            {/* BASIC DETAILS */}
            <Text style={styles.sectionTitle}>Basic Details</Text>
            <Field label="Lead Name" required>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={v => set('name', v)}
                placeholder="Enter lead name"
              />
            </Field>

            <View style={styles.row2}>
              <View style={styles.half}>
                <Field label="Email">
                  <TextInput
                    style={styles.input}
                    value={form.email}
                    onChangeText={v => set('email', v)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="name@example.com"
                  />
                </Field>
              </View>
              <View style={styles.half}>
                <Field label="Mobile">
                  <TextInput
                    style={styles.input}
                    value={form.mobileNumber}
                    onChangeText={v => set('mobileNumber', v)}
                    keyboardType="phone-pad"
                    placeholder="+370 98xxxxxx"
                  />
                </Field>
              </View>
            </View>

            {/* <Field label="Client Category"> */}
            <OptionSelectWithAdd
              label="Client Category"
              value={form.clientCategory}
              options={categories}
              onChange={opt => set('clientCategory', opt.categoryName)}
              onAddPress={() => setAddCategoryOpen(true)}
            />
            {/* </Field> */}

            {/* <Field label="Lead Source"> */}
            <OptionSelectWithAdd
              label="Lead Source"
              value={form.leadSource}
              options={leadSources}
              onChange={opt => set('leadSource', opt.name)}
              onAddPress={() => setAddSourceOpen(true)}
            />
            {/* </Field> */}

            {/* OWNER INFO */}
            <Text style={styles.sectionTitle}>Owner & Created By</Text>
            <View style={styles.row2}>
              <View style={styles.half}>
                <Field label="Lead Owner (Employee ID)" required>
                  <EmployeeSelect
                    value={form.leadOwner}
                    options={empOptions}
                    onChange={v => set('leadOwner', v)}
                  />
                </Field>
              </View>
              <View style={styles.half}>
                <Field label="Added By (Employee ID)" required>
                  <EmployeeSelect
                    value={form.addedBy}
                    options={empOptions}
                    onChange={v => set('addedBy', v)}
                  />
                </Field>
              </View>
            </View>

            {/* COMPANY DETAILS */}
            <Text style={styles.sectionTitle}>Company Details</Text>

            <Field label="Company Name">
              <TextInput
                style={styles.input}
                value={form.companyName}
                onChangeText={v => set('companyName', v)}
                placeholder="Global Corporation Ltd."
              />
            </Field>

            <Field label="Official Website">
              <TextInput
                style={styles.input}
                value={form.officialWebsite}
                onChangeText={v => set('officialWebsite', v)}
                autoCapitalize="none"
                placeholder="https://www.example.com"
              />
            </Field>

            <View style={styles.row2}>
              <View style={styles.half}>
                <Field label="Office Phone">
                  <TextInput
                    style={styles.input}
                    value={form.officePhone}
                    onChangeText={v => set('officePhone', v)}
                    keyboardType="phone-pad"
                    placeholder="+44-20-7940-0290"
                  />
                </Field>
              </View>
              <View style={styles.half}>
                <Field label="Postal Code">
                  <TextInput
                    style={styles.input}
                    value={form.postalCode}
                    onChangeText={v => set('postalCode', v)}
                    placeholder="SW1A 1AA"
                  />
                </Field>
              </View>
            </View>

            <View style={styles.row2}>
              <View style={styles.half}>
                <Field label="City">
                  <TextInput
                    style={styles.input}
                    value={form.city}
                    onChangeText={v => set('city', v)}
                    placeholder="London"
                  />
                </Field>
              </View>
              <View style={styles.half}>
                <Field label="State / Province">
                  <TextInput
                    style={styles.input}
                    value={form.state}
                    onChangeText={v => set('state', v)}
                    placeholder="England"
                  />
                </Field>
              </View>
            </View>

            <Field label="Country">
              <TextInput
                style={styles.input}
                value={form.country}
                onChangeText={v => set('country', v)}
                placeholder="United Kingdom"
              />
            </Field>

            <Field label="Company Address">
              <TextInput
                style={[styles.input, { minHeight: 70 }]}
                value={form.companyAddress}
                onChangeText={v => set('companyAddress', v)}
                multiline
                placeholder="1 Parliament Square, Westminster"
              />
            </Field>

            {/* DEAL TOGGLES */}
            <View style={styles.rowSwitch}>
              <Text style={styles.label}>Create Deal</Text>
              <Switch
                value={form.createDeal}
                onValueChange={v => set('createDeal', v)}
              />
            </View>
            <View style={[styles.rowSwitch, { marginBottom: 12 }]}>
              <Text style={styles.label}>Auto Convert To Client</Text>
              <Switch
                value={form.autoConvertToClient}
                onValueChange={v => set('autoConvertToClient', v)}
              />
            </View>

            {/* DEAL DETAILS */}
            {form.createDeal && (
              <View style={styles.block}>
                <Text style={styles.sectionTitle}>Deal Details</Text>

                <Field label="Deal Title">
                  <TextInput
                    style={styles.input}
                    value={form.deal.title}
                    onChangeText={v => setDeal('title', v)}
                    placeholder="Misso"
                  />
                </Field>

                <Field label="Pipeline">
                  <ChoicePills
                    options={PIPELINES}
                    value={form.deal.pipeline}
                    onChange={v => setDeal('pipeline', v)}
                  />
                </Field>

                <Field label="Stage">
                  <ChoicePills
                    options={DEAL_STAGES}
                    value={form.deal.dealStage}
                    onChange={v => setDeal('dealStage', v)}
                  />
                </Field>

                <OptionSelectWithAdd
                  label="Deal Category"
                  value={form.deal.dealCategory}
                  options={dealCategories}
                  onChange={opt => setDeal('dealCategory', opt.categoryName)}
                  onAddPress={() => setAddDealCatOpen(true)}
                />

                <View style={styles.row2}>
                  <View style={styles.half}>
                    <Field label="Value (number)">
                      <TextInput
                        style={styles.input}
                        value={String(form.deal.value ?? '')}
                        onChangeText={v => setDeal('value', v)}
                        keyboardType="numeric"
                        placeholder="50000"
                      />
                    </Field>
                  </View>
                  <View style={styles.half}>
                    <Field label="Expected Close Date">
                      <Pressable
                        style={styles.input}
                        onPress={() => setShowDate(true)}
                      >
                        <Text>
                          {form.deal.expectedCloseDate || 'Select date'}
                        </Text>
                      </Pressable>

                      {showDate && (
                        <DateTimePicker
                          value={
                            form.deal.expectedCloseDate
                              ? new Date(form.deal.expectedCloseDate)
                              : new Date()
                          }
                          mode="date"
                          onChange={(_, d) => {
                            setShowDate(false);
                            if (d) {
                              setDeal(
                                'expectedCloseDate',
                                d.toISOString().slice(0, 10),
                              );
                            }
                          }}
                        />
                      )}
                    </Field>
                  </View>
                </View>

                <View style={styles.row2}>
                  <View style={styles.half}>
                    <Field label="Deal Agent (Employee)">
                      <EmployeeSelect
                        value={form.deal.dealAgent}
                        options={empOptions}
                        onChange={v => setDeal('dealAgent', v)}
                      />
                    </Field>
                  </View>
                  <View style={styles.half}>
                    <Field label="Deal Watchers">
                      {/* Closed dropdown */}
                      <Pressable
                        style={styles.input}
                        onPress={() => setOpenWatchers(true)}
                      >
                        <Text numberOfLines={1}>
                          {form.deal.dealWatchers?.length
                            ? form.deal.dealWatchers.join(', ')
                            : 'Select watchers'}
                        </Text>
                      </Pressable>
                    </Field>

                    {/* Dropdown modal */}
                    {openWatchers && (
                      <MultiEmployeeSelect
                        value={form.deal.dealWatchers}
                        options={empOptions}
                        onChange={v => setDeal('dealWatchers', v)}
                        onClose={() => setOpenWatchers(false)}
                      />
                    )}
                  </View>
                </View>
              </View>
            )}

            <AddOptionModal
              visible={addSourceOpen}
              title="Add Lead Source"
              placeholder="Facebook"
              onClose={() => setAddSourceOpen(false)}
              onSave={async name => {
                const item = await leadSourceAPI.create(name);
                setLeadSources(s => [...s, item]);
                set('leadSource', item.name);
              }}
            />

            <AddOptionModal
              visible={addCategoryOpen}
              title="Add Client Category"
              placeholder="Corporate"
              onClose={() => setAddCategoryOpen(false)}
              onSave={async name => {
                const item = await clientCategoryAPI.create(name);
                setCategories(s => [...s, item]);
                set('clientCategory', item.categoryName);
              }}
            />

            <AddOptionModal
              visible={addDealCatOpen}
              title="Add Deal Category"
              placeholder="Enterprise"
              onClose={() => setAddDealCatOpen(false)}
              onSave={async name => {
                const item = await dealCategoryAPI.create({
                  categoryName: name,
                });
                setDealCategories(s => [...s, item]);
                setDeal('dealCategory', item.categoryName);
              }}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Text style={styles.btnTxtDark}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, valid ? styles.save : styles.saveDisabled]}
              onPress={submit}
              disabled={!valid || saving}
            >
              <Text style={styles.btnTxtLight}>
                {saving ? 'Saving…' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: '90%',
    padding: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#6b7280',
    marginBottom: 6,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#fff',
    fontSize: 13,
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  rowSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  row2: {
    flexDirection: 'row',
    gap: 8,
  },
  half: {
    flex: 1,
  },
  block: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancel: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  save: {
    backgroundColor: '#111827',
  },
  saveDisabled: {
    backgroundColor: '#9ca3af',
  },
  btnTxtLight: {
    color: '#fff',
    fontWeight: '900',
  },
  btnTxtDark: {
    color: '#111827',
    fontWeight: '900',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  pillSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  pillText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#ffffff',
  },
});
