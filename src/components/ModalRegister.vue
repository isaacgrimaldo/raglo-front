<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import UserService from '../services/users/users.service'
import { Field, Form, ErrorMessage } from 'vee-validate';
import InlineMessage from 'primevue/inlinemessage';
import * as yup from 'yup'
import { reactive } from 'vue'

const props = defineProps(['visible'])
const emit = defineEmits(['closeMolda'])

const error = reactive({
    message: '',
    error: false
})

const data = reactive({
    name: ''
})


const passwordRules = yup.string().required("Este Valor es Requerido").min(3, "Debe tener por lo menos 3 letras");

const close = async () => {
    const validate = await passwordRules.validate(data.name)
    try {
        if (validate) {
            await UserService.createUser(data.name.trimEnd())
            localStorage.setItem('user', data.name.trimEnd())
            emit('closeMolda', false)
        }


    } catch (err) {
        const message = String(err)
        error.error = true
        error.message = message
    }
}

</script>


<template>
    <Dialog v-model:visible="props.visible" modal :pt="{
        mask: {
            style: 'backdrop-filter: blur(2px)'
        }
    }" class="dialog-container">
        <template #container>
            <div class="flex flex-column px-8 py-5 gap-4"
                style="background: rgb(212,63,106);background: linear-gradient(315deg, rgba(212,63,106,1) 0%, rgba(109,77,157,1) 35%);;  border-radius: 5px;">
                <Form>
                    <Field v-slot="{ field }" v-model="data.name" name="name" :rules="passwordRules" >
                        <div class="inline-flex flex-column gap-2">
                            <label for="username" class="text-primary-50 font-semibold">Username</label>
                            <InputText id="username" v-bind="field"></InputText>
                            <InlineMessage v-show="error.error === true" class="p-invalid">Este Usuario ya existe
                            </InlineMessage>
                            <ErrorMessage name="name" class="font-semibold	text-red-400 text-center" />
                        </div>
                    </Field>
                </Form>
                <div class="flex align-items-center gap-2">
                    <Button label="Registrarse" style="background-color: black ; border-radius: 15px;" @click="close" text
                        class="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped></style>