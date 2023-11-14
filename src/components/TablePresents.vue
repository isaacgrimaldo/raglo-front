<script lang="ts" setup>
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import UserService from "../services/users/users.service";
import { UserDto } from "../services/users/dtos/UserDto";
import ModalEditInformation from "./ModalEditInformation.vue";
import { onMounted, onBeforeMount, ref } from "vue";
import ModalRegister from "../components/ModalRegister.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";

const show = ref<boolean>(false);
const showModalRegister = ref<boolean>(false);
const usersRef = ref<UserDto[]>([]);
const editData = ref<UserDto>();
const showReal = ref(false);
const nameLocal = ref();

onMounted(async () => {
  const users = await UserService.getUser();
  usersRef.value = users;
  const hasLocalUser = localStorage.getItem("user");
  if (hasLocalUser) {
    try {
      await UserService.getUserByName(hasLocalUser);
      showModalRegister.value = false;
      nameLocal.value = hasLocalUser;
    } catch (error) {
      console.log(error);

      localStorage.removeItem("user");
      showModalRegister.value = true;
    }
  } else {
    showModalRegister.value = true;
  }
});

const confirm = useConfirm();
const toast = useToast();

const confirm1 = () => {
  confirm.require({
    message: `Advertencia: si cierras la sesión, 
          no podrás entrar con este usuario. 
          No te preocupes, solo tendrás que rogar por ayuda al todopoderoso administrador (también conocido como el magnánimo Isaac)
         `,
    header: "Cerrar session",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      toast.add({
        severity: "info",
        summary: "Confirmar",
        detail: "Has cerrado tu sesión",
        life: 3000,
      });
      localStorage.removeItem("user");
      showModalRegister.value = true;
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Cancelación",
        detail: "sea cancelado el cierre de sesión",
        life: 3000,
      });
    },
  });
};

const openModal = (data: UserDto) => {
  editData.value = data;
  show.value = true;
};

const closeModal = async (close: boolean) => {
  const users = await UserService.getUser();
  usersRef.value = users;
  show.value = close;
};

const closeModalRegister = async (close: boolean) => {
  const users = await UserService.getUser();
  usersRef.value = users;
  showModalRegister.value = close;
  const hasLocalUser = localStorage.getItem("user");
  nameLocal.value = hasLocalUser;
};

onBeforeMount(() => {
  if (!localStorage.getItem("user")) {
    showModalRegister.value = true;
  } else {
    showModalRegister.value = false;
  }
});

const deleteUser = async (info: UserDto) => {
  const user = localStorage.getItem("user");
  try {
    if (user && user === "Isaac Grimaldo") {
      await UserService.delete(info.id);
      const users = await UserService.getUser();
      usersRef.value = users;
    } else {
      throw new Error("No eres real hasta la muerte");
    }
  } catch (error) {
    showReal.value = true;
  }
};
</script>

<template>
  <Toast />
  <ConfirmDialog class="max-w-30rem">
    <template #message="slotProps">
      <div
        class="flex flex-column align-items-center w- gap-3 border-bottom-1 surface-border"
      >
        <i
          :class="slotProps.message.icon"
          class="text-6xl text-primary-500"
        ></i>
        <p class="text-2xl">{{ slotProps.message.message }}</p>
      </div>
    </template>
  </ConfirmDialog>

  <div class="flex w-full justify-content-evenly">
    <Button
      @click="confirm1()"
      icon="pi pi-check"
      label="Cerrar Sección"
    ></Button>

    <h4 class="text-basic">
      Tu eres <strong class="text-indigo-500 text-lg">{{ nameLocal }}</strong>
    </h4>
  </div>

  <ModalRegister
    :visible="showModalRegister"
    @closeMolda="closeModalRegister"
  />
  <ModalEditInformation
    :visible="show"
    :data="editData"
    @closeMolda="closeModal"
  />

  <Dialog
    v-model:visible="showReal"
    modal
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <h1>NO ERES REAL HASTA LA MUERTE</h1>

    <iframe
      width="560"
      height="315"
      class=""
      src="https://www.youtube.com/embed/WFvpLGjv9ig?si=mn9vyqBh8_fsq4yr&autoplay=1"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      autoplay
      id="youtubeIframe"
    >
    </iframe>
    <h1>Solo los reales pueden borrar usuarios brrr</h1>
  </Dialog>

  <div class="container">
    <DataTable
      :value="usersRef"
      :resizableColumns="true"
      showGridlines
      sortMode="multiple"
      style="border-radius: 15px"
    >
      <template #header>
        <div class="flex text-center">
          <span
            class="text-3xl w-full text-900 font-bold text-center text-white"
            >Participantes</span
          >
        </div>
      </template>
      <Column field="name" v header="Name" sortable> </Column>
      <Column field="hasGiftGood" header="Regalo de broma">
        <template #body="{ data }">
          <div class="success-register" v-if="data.hasGiftBad">
            Registrado <i class="pi pi-check"></i>
          </div>
          <div class="void-register" v-if="!data.hasGiftBad">
            Sin registrar <i class="pi pi-times"></i>
          </div>
        </template>
      </Column>
      <Column field="hasGiftGood" header="Regalo bueno">
        <template #body="{ data }">
          <div class="success-register" v-show="data.hasGiftGood">
            Registrado <i class="pi pi-check"></i>
          </div>
          {{ console.log(data) }}
          <div class="void-register" v-show="!data.hasGiftGood">
            Sin registrar <i class="pi pi-times"></i>
          </div>
        </template>
      </Column>
      <Column field="actions" header="acciones">
        <template #body="{ data }">
          <div class="actions-container">
            <i
              class="pi pi-trash action-icon"
              v-if="data.name !== nameLocal"
              @click="deleteUser(data)"
            ></i>
            <i
              class="pi pi-user-edit action-icon"
              v-if="data.name !== nameLocal"
              @click="openModal(data)"
            ></i>
            <i
              class="pi pi-verified action-icon"
              v-if="data.name == nameLocal"
            ></i>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  margin: auto;
  margin-block: 20px;
}

:deep(.p-datatable .p-datatable-header) {
  border-radius: 15px 15px 0px 0px;
  background-color: #226ef9;
  border: none;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1.2rem;
  text-align: center;
  position: relative;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 1.5rem;
  color: white;
  background-color: #226ef9;
  border: none;
}

:deep(.p-column-title) {
  text-align: center;
  font-size: 20px;
  width: 100%;
}

.void-register {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fc2e1f;
  font-size: 18px;
  font-weight: 800;
  color: white;
  opacity: 0.8;
  gap: 15px;
}

.success-register {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #94ce37;
  opacity: 0.8;
  font-size: 18px;
  font-weight: 800;
  color: white;
  gap: 15px;
}

.action-icon {
  background-color: #fcde00;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.action-icon:hover {
  opacity: 0.5;
  cursor: pointer;
}

.actions-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 15px;
}

i {
  font-size: 1.5rem;
}

#youtubeIframe {
  width: 560px;
  height: 315px;
}

/* Media query para pantallas más pequeñas (móviles) */
@media (max-width: 767px) {
  #youtubeIframe {
    width: 100%;
    /* O el ancho deseado para pantallas móviles */
    height: 200px;
    /* O la altura deseada para pantallas móviles */
  }
}
</style>
