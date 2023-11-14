<script lang="ts" setup>
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { toRefs, reactive, ref, onMounted, watchEffect   } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import InputText from "primevue/inputtext";
import UserService from "../services/users/users.service";
import SelectButton from "primevue/selectbutton";
import { UserDto } from "../services/users/dtos/UserDto";

const props = defineProps(["data", "visible"]);
const emit = defineEmits(["closeMolda"]);
const error = reactive({
  message: "",
  error: false,
});

const options = ref(["si"]);
const optionSelected = ref(false);
const typePerson = ref("");

const { visible } = toRefs(props);
const data = reactive({
  name: "",
  hasGiftGood: "",
  hasGiftBad: "",
});

onMounted(() => {
   optionSelected.value = false
});


watchEffect(() => {
  console.log(props.data);
  if (props.data) {
    data.name = props.data.name;
  }
});

watchEffect(() => {
  if (data.hasGiftBad === "si") {
    optionSelected.value = true;
    typePerson.value = "B";
  }

  optionSelected.value = true;
  if (data.hasGiftGood === "si") {
    typePerson.value = "G";
  }
});


const restarValues = async () => {
  data.name = ""
  data.hasGiftBad = ""
  data.hasGiftGood = ""
};

const close = async () => {
  const info: Partial<UserDto> = {};

  try {
    const user = localStorage.getItem("user");
    if (user && optionSelected.value ) {
      if( typePerson.value === "G"){
        info.personGoodGift = user
        info.hasGiftGood =   true
      } else {
        info.personGoodBad = user
        info.hasGiftBad =true   
      }
     
      await UserService.updateUser(info, props.data.id);
      await restarValues();
      emit("closeMolda", false);
      optionSelected.value = false;
    }
  } catch (err) {
    const message = String(err);
    error.error = true;
    error.message = message;
  }
};

const cancel = async  () => {
  await restarValues();
  emit("closeMolda", false);
  optionSelected.value = false;
};

</script>

<template>
  <Dialog
    v-model:visible="visible"
    header="Header"
    modal
    :pt="{
      mask: {
        style: 'backdrop-filter: blur(2px)',
      },
    }"
    class="dialog-container"
  >
    |<template #header> </template>
    <template #container>
      <div
        class="flex flex-column px-8 py-5 gap-4"
        style="
          background: rgb(212, 63, 106);
          background: linear-gradient(
            315deg,
            rgba(212, 63, 106, 1) 0%,
            rgba(109, 77, 157, 1) 35%
          );
          border-radius: 5px;
        "
      >
        <Form
          class="flex flex-column gap-5 justify-content-center align-items-center"
        >
          <Field v-slot="{ field }" v-model="data.name" name="name">
            <div class="inline-flex flex-column gap-2">
              <label for="name" class="text-primary-50 font-semibold"
                >El Afortunado es:</label
              >
              <InputText
                id="name"
                v-bind="field"
                disabled
                class="bg-blue-50"
              ></InputText>
            </div>
          </Field>

          <div
            v-if="!optionSelected"
            class="flex flex-column gap-5 justify-content-center align-items-center"
          >
            <Field
              v-slot="{ field }"
              v-if="!props.data.hasGiftGood"
              v-model="data.hasGiftGood"
              name="hasGiftGood"
            >
              <div
                class="flex flex-column justify-content-center align-items-center gap-2"
              >
                <label for="hasGiftGood" class="text-primary-50 font-semibold">
                  ¿Te toco el regalo chido?
                </label>
                <SelectButton
                  v-model="data.hasGiftGood"
                  v-bind="field.onChange"
                  :options="options"
                />
                <ErrorMessage name="hasGiftGood" class="error" />
              </div>
            </Field>

            <div v-show="props.data.hasGiftGood">
              <h2 class="text-base">¡Ups! Parece que alguien más ya tuvo el honor de regalar el regalo chido</h2>
            </div>

            <Field
              v-if="!props.data.hasGiftBad"
              v-model="data.hasGiftBad"
              name="hasGiftBad"
              v-slot="{field}"
            >
              <div
                class="flex flex-column justify-content-center align-items-center gap-2"
              >
                <label for="hasGiftGood" class="text-primary-50 font-semibold">
                  ¿Te toco el regalo feo?
                </label>
                <SelectButton
                  v-model="data.hasGiftBad"
                  v-bind="field['onUpdate:modelValue']"
                  :options="options"
                />
                <ErrorMessage name="hasGiftBad" class="error" />
              </div>
            </Field>

            <div v-show="props.data.hasGiftBad">
              <h2 class="text-base">"¡Ups! Parece que alguien más ya tuvo el honor de regalar el regalo feo</h2>
            </div>
          </div>

          <div v-if="optionSelected">
            <h4 class="text-sm">
                ¿Listo para hacer oficial este registro? Dale a 'Guardar'. Si cambias de opinión, 'Cancelar' está ahí para ti.
            </h4>
          </div>
        </Form>

        <div class="flex align-items-center gap-2">
          <Button
            v-show="!props.data.hasGiftBad || !props.data.hasGiftGood"
            label="Guardar"
            style="background-color: black; border-radius: 15px"
            @click.prevent="close()"
            text
            class="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
          ></Button>

          <Button
            label="Cancelar"
            style="background-color: black; border-radius: 15px"
            @click.prevent="cancel"
            text
            class="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
          ></Button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
 
 .dialog-container{
    max-width: 500px;
 }

</style>
