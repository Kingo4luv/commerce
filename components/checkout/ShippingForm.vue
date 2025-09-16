<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  recipientFirstName: string
  recipientLastName: string
  recipient_phone: string
  recipient_email: string
  city: string
  state: string
  sameContact: boolean
  selectedState: any
  selectedCity: any
  checkedItems: string[]
  storedAddressChecked: boolean[]
  errors: Record<string, string>
  merchant: any
}

interface Emits {
  (e: 'update:firstName', value: string): void
  (e: 'update:lastName', value: string): void
  (e: 'update:phone', value: string): void
  (e: 'update:email', value: string): void
  (e: 'update:address', value: string): void
  (e: 'update:recipientFirstName', value: string): void
  (e: 'update:recipientLastName', value: string): void
  (e: 'update:recipient_phone', value: string): void
  (e: 'update:recipient_email', value: string): void
  (e: 'update:city', value: string): void
  (e: 'update:state', value: string): void
  (e: 'update:sameContact', value: boolean): void
  (e: 'update:checkedItems', value: string[]): void
  (e: 'update:storedAddressChecked', value: boolean[]): void
  (e: 'shipping-type-change', type: string): void
  (e: 'same-contact-change'): void
  (e: 'store-address-change'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localFirstName = ref(props.firstName)
const localLastName = ref(props.lastName)
const localPhone = ref(props.phone)
const localEmail = ref(props.email)
const localSameContact = ref(props.sameContact)
const localRecipientFirstName = ref(props.recipientFirstName)
const localRecipientLastName = ref(props.recipientLastName)
const localRecipientEmail = ref(props.recipient_email)
const localRecipientPhone = ref(props.recipient_phone)
const localAddress = ref(props.address)

// Sync local variables with prop changes
watch(
  () => props.sameContact,
  newValue => {
    localSameContact.value = newValue
  }
)

watch(
  () => props.recipientFirstName,
  newValue => {
    localRecipientFirstName.value = newValue
  }
)

watch(
  () => props.recipientLastName,
  newValue => {
    localRecipientLastName.value = newValue
  }
)

watch(
  () => props.recipient_email,
  newValue => {
    localRecipientEmail.value = newValue
  }
)

watch(
  () => props.recipient_phone,
  newValue => {
    localRecipientPhone.value = newValue
  }
)

watch(
  () => props.address,
  newValue => {
    localAddress.value = newValue
  }
)

watch(
  () => props.firstName,
  newValue => {
    localFirstName.value = newValue
  }
)

watch(
  () => props.lastName,
  newValue => {
    localLastName.value = newValue
  }
)

watch(
  () => props.phone,
  newValue => {
    localPhone.value = newValue
  }
)

watch(
  () => props.email,
  newValue => {
    localEmail.value = newValue
  }
)

const handleSameContact = (type: string) => {
  localSameContact.value = !localSameContact.value
  emit('update:sameContact', localSameContact.value)

  if (localSameContact.value) {
    localRecipientFirstName.value = props.firstName
    localRecipientLastName.value = props.lastName
    localRecipientEmail.value = props.email
    localRecipientPhone.value = props.phone
    emit('update:recipient_phone', props.phone)
    emit('update:recipient_email', props.email)
    emit('update:recipientFirstName', props.firstName)
    emit('update:recipientLastName', props.lastName)
  } else {
    localRecipientFirstName.value = ''
    localRecipientLastName.value = ''
    localRecipientEmail.value = ''
    localRecipientPhone.value = ''
    emit('update:recipient_phone', '')
    emit('update:recipient_email', '')
    emit('update:recipientFirstName', '')
    emit('update:recipientLastName', '')
  }
}

// Handle shipping type change
const handleShippingType = (type: string) => {
  if (type === 'Merchant Shop Pickup') {
    emit('update:checkedItems', ['Merchant Shop Pickup'])
  } else if (type === 'Shipping') {
    emit('update:checkedItems', ['Shipping'])
  }
}

// Handle store address checkbox
const handleStoreAddress = (type: string) => {
  const newStoredAddressChecked = [type === 'Save this Address']
  emit('update:storedAddressChecked', newStoredAddressChecked)
}
</script>
<template>
  <div class="body pt-1 pb-10 h-full overflow-y-auto">
    <div class="px-4 pt-4 space-y-1">
      <AtomsKlumpHeading
        text-size="base"
        weight="normal"
      >
        Select how you want you items delivered
      </AtomsKlumpHeading>
      <AtomsKlumpCheckbox
        :checked-items="checkedItems"
        :items="[{ name: 'Shipping' }, { name: 'Merchant Shop Pickup' }]"
        @change="handleShippingType"
      />
    </div>

    <div class="px-4 pt-4 pb-32 space-y-4">
      <div class="w-full grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <AtomsKlumpLabel text="First Name" />
          <AtomsKlumpInput
            v-model="localFirstName"
            @input="$emit('update:firstName', $event)"
            placeholder="First Name"
            :error="errors.firstName ? errors.firstName : ''"
          />
        </div>
        <div class="space-y-1">
          <AtomsKlumpLabel text="Last Name" />
          <AtomsKlumpInput
            v-model="localLastName"
            @input="$emit('update:lastName', $event)"
            placeholder="Last Name"
            :error="errors.lastName ? errors.lastName : ''"
          />
        </div>
      </div>

      <div class="space-y-1">
        <AtomsKlumpLabel text="Phone Number" />
        <AtomsKlumpInput
          v-model="localPhone"
          @input="$emit('update:phone', $event)"
          placeholder="Enter Phone"
          :error="errors.phone ? errors.phone : ''"
        />
      </div>

      <div class="space-y-1">
        <AtomsKlumpLabel text="Email" />
        <AtomsKlumpInput
          v-model="localEmail"
          @input="$emit('update:email', $event)"
          placeholder="Enter Email"
          :error="errors.email ? errors.email : ''"
        />
      </div>

      <div
        v-if="checkedItems.includes('Shipping')"
        class="pt-0 space-y-3"
      >
        <AtomsKlumpHeading
          text-size="large"
          weight="bold"
        >
          Shipping Information
        </AtomsKlumpHeading>

        <AtomsKlumpCheckbox
          :items="[{ name: 'Contact same as above?' }]"
          @change="handleSameContact"
        />

        <div class="w-full grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <AtomsKlumpLabel text="First Name" />
            <AtomsKlumpInput
              v-model="localRecipientFirstName"
              @input="$emit('update:recipientFirstName', $event)"
              placeholder="First Name"
              :error="errors.recipientFirstName ? errors.recipientFirstName : ''"
            />
          </div>
          <div class="space-y-1">
            <AtomsKlumpLabel text="Last Name" />
            <AtomsKlumpInput
              v-model="localRecipientLastName"
              @input="$emit('update:recipientLastName', $event)"
              placeholder="Last Name"
              :error="errors.recipientLastName ? errors.recipientLastName : ''"
            />
          </div>
        </div>

        <div class="space-y-1">
          <AtomsKlumpLabel text="Recipient Email" />
          <AtomsKlumpInput
            v-model="localRecipientEmail"
            @input="$emit('update:recipient_email', $event)"
            placeholder="Enter Recipient Email"
            :disabled="localSameContact"
            :error="errors.recipient_email ? errors.recipient_email : ''"
            :readonly="localSameContact"
          />
        </div>

        <div class="space-y-1">
          <AtomsKlumpLabel text="Recipient Phone Number" />
          <AtomsKlumpInput
            v-model="localRecipientPhone"
            @input="$emit('update:recipient_phone', $event)"
            placeholder="Enter Recipient Phone"
            :disabled="localSameContact"
            :error="errors.recipient_phone ? errors.recipient_phone : ''"
            :readonly="localSameContact"
          />
        </div>

        <div class="space-y-1">
          <AtomsKlumpLabel text="Delivery Address" />
          <AtomsKlumpInput
            v-model="localAddress"
            @input="$emit('update:address', $event)"
            placeholder="Enter address"
            :error="errors.address ? errors.address : ''"
          />
        </div>

        <div class="w-full grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <AtomsKlumpInput
              :value="state"
              @input="$emit('update:state', $event)"
              :placeholder="selectedState !== null ? selectedState.name : 'State'"
              :disabled="selectedState !== null"
            />
          </div>
          <div class="space-y-1">
            <AtomsKlumpInput
              :value="city"
              @input="$emit('update:city', $event)"
              :placeholder="selectedCity !== null ? selectedCity.name : 'City'"
              :disabled="selectedCity !== null"
            />
          </div>
        </div>

        <div class="pb-16">
          <AtomsKlumpCheckbox
            :checked-items="storedAddressChecked[0] ? ['Save this Address'] : []"
            :items="[{ name: 'Save this Address' }]"
            @change="handleStoreAddress"
          />
        </div>
      </div>
    </div>

    <div v-if="checkedItems.includes('Merchant Shop Pickup')">
      <MoleculesKlumpMerchantAddress
        class="px-4"
        :merchant="merchant"
      />
    </div>
  </div>
</template>
