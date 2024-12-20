<template>
  <div class="content-area">
    <div class="flex-between mb-normal">
      <DefaultButton @executeAction="addRevenue" style="background-color: var(--red-dark-color)">
        <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
        <span class="button-text">Nova Receita</span>
      </DefaultButton>
      <div style="display: flex; justify-content: flex-end">
        <MonthFilter
          @get-month="getMonth"
          @get-year="getYear"
          @get-status="getStatus"
          :statusList="statusList"
        />
        <SearchFilter @apply-search="applySearch" />
      </div>
    </div>
    <RevenuesTable
      :data="filteredRevenue"
      :searchedField="searchedField"
      :requestMessage="requestMessage"
      @updateItem="updateRevenue"
      @deleteItem="showDeleteModal"
    />
    <ModalCard
      v-if="showModal"
      :isForm="isForm"
      @executeAction="getModalAction"
      @closeModal="closeModal"
    >
      <h3 v-if="action === 'delete'" class="message-area">
        Tem certeza que deseja excluir o recebimento da mensalidade do cliente
        <strong class="highlight">{{ messageData.name }}</strong>
        referente ao mês de
        <strong class="highlight">{{ messageData.date }}</strong>?
      </h3>
      <h3 v-else-if="showConfirmation" class="message-area">
        O valor atual da mensalidade do cliente
        <strong class="highlight">{{ confirmationData.name }}</strong> é de
        <strong class="highlight">R${{ formatValue(confirmationData.currentValue) }}</strong>
        segundo o seu cadastro. Você gostaria de atualizar todos os futuros pagamentos deste cliente
        para este novo valor de
        <strong class="highlight">R${{ formatValue(confirmationData.updatedValue) }}</strong>?
      </h3>
      <RevenueForm
        v-else
        :item="selectedRevenue"
        :customers="apiStore.customers"
        :action="action"
        :modalTitle="modalTitle"
        @closeModal="closeModal"
        @showMessage="showMessage"
        @getConfirmation="getConfirmation"
      />
    </ModalCard>
    <div v-if="showModal" class="defocus"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import RevenuesTable from "@/components/tables/RevenuesTable.vue";
import DefaultButton from "@/components/common/DefaultButton.vue";
import SearchFilter from "@/components/common/SearchFilter.vue";
import ModalCard from "@/components/common/ModalCard.vue";
import MonthFilter from "@/components/common/MonthFilter.vue";
import RevenueForm from "../forms/RevenueForm.vue";
import { type Revenue, type UpdatedRevenue, type Message } from "@/types/revenue";
import { useApiStore } from "@/stores/api";
import { useDateUtils } from "@/utils/dateUtils";
import { useDataUtils } from "@/utils/dataUtils";
import axios from "axios";

const apiStore = useApiStore();
const { filteredData } = useDataUtils();
const { getNextMonth } = useDateUtils();
const emit = defineEmits(["showMessage"]);

const statusList = ref<string[]>(["Pago", "À pagar", "Link enviado", "Todos"]);
const searchedField = ref<string[]>([]);
const showModal = ref<boolean>(false);
const selectedRevenue = ref<Revenue>({} as Revenue);
const action = ref<"create" | "update" | "delete" | "">("");
const messageData = ref<Message>({} as Message);
const modalTitle = ref<string>("");
const requestMessage = ref<string>("");
const currentMonth = ref<string>("");
const currentYear = ref<number>(0);
const currentStatus = ref<string>("");
const showConfirmation = ref<boolean>(false);
const confirmationData = ref<UpdatedRevenue>({} as UpdatedRevenue);
const isForm = ref<boolean>(false);

const filteredRevenue = computed(() => {
  return filteredData(
    apiStore.revenue as Revenue[],
    currentMonth.value,
    currentYear.value,
    currentStatus.value
  ) as Revenue[];
});

const getMonth = (month: string) => {
  currentMonth.value = month;
};

const getYear = (year: number) => {
  currentYear.value = year;
};

const getStatus = (status: string) => {
  currentStatus.value = status;
};

const applySearch = (field: string[]) => {
  searchedField.value = field;
};

const addRevenue = () => {
  showModal.value = true;
  isForm.value = true;
  action.value = "create";
  modalTitle.value = "Adicionar Receita";
};

const updateRevenue = (item: Revenue) => {
  selectedRevenue.value = item;
  showModal.value = true;
  isForm.value = true;
  action.value = "update";
  modalTitle.value = "Atualizar Receita";
};

const deleteRevenue = async () => {
  try {
    await axios.delete(`${apiStore.apiURL}/revenue/${selectedRevenue.value.id}/`);
    showMessage("Receita excluída com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir receita.", error);

    showMessage("Erro ao excluir receita.");
  }

  showModal.value = false;
  await apiStore.fetchRevenue();
};

const showDeleteModal = (item: Revenue) => {
  selectedRevenue.value = item;
  showModal.value = true;
  action.value = "delete";
  let date = `${item.month}/${item.year}`;

  messageData.value = {
    name: item.name,
    date: date
  };
};

const closeModal = () => {
  showModal.value = false;
  isForm.value = false;
  showConfirmation.value = false;
  action.value = "";
};

const showMessage = (msg: string) => {
  requestMessage.value = msg;
};

const getConfirmation = (data: UpdatedRevenue) => {
  confirmationData.value = data;
  showModal.value = true;
  showConfirmation.value = true;
};

const getModalAction = async () => {
  if (showConfirmation.value) {
    await updateCustomerValue();
    updateFutureRevenue();

    closeModal();
    await apiStore.fetchData();
  } else {
    deleteRevenue();
  }
};

const updateFutureRevenue = () => {
  let nextMonth = getNextMonth(
    confirmationData.value.month,
    confirmationData.value.year
  );
  let nextRevenues = apiStore.revenue.filter(
    (e) => e.month === nextMonth.month && e.year === nextMonth.year
  );

  for (let i = 0; i < nextRevenues.length; i++) {
    updateRevenueValue(nextRevenues[i].id);
  }
};

const updateCustomerValue = async () => {
  try {
    let updatedCustomer = {
      value: confirmationData.value.updatedValue
    };

    await axios.patch(
      `${apiStore.apiURL}/customer/${confirmationData.value.id}/`,
      updatedCustomer
    );
    emit("showMessage", "Cliente atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar cliente.", error);
    emit("showMessage", "Erro ao atualizar cliente.");
  }
};

const updateRevenueValue = async (id: number) => {
  try {
    let updatedRevenue = {
      value: confirmationData.value.updatedValue
    };
    await axios.patch(`${apiStore.apiURL}/revenue/${id}/`, updatedRevenue);
  } catch (error) {
    console.error("Erro ao atualizar receita.", error);
  }
};

const incrementData = () => {
  apiStore.customers.forEach((customer) => {
    const matchingRevenues = apiStore.revenue.filter(
      (revenue) => revenue.customer === customer.id
    );

    matchingRevenues.forEach((matchingRevenue) => {
      matchingRevenue.name = customer.name
      matchingRevenue.start = customer.start
      matchingRevenue.plan = customer.plan
      matchingRevenue.status = customer.status
    });
  });
};

const formatValue = (value: number) => {
  return value.toFixed(2).toString().replace(/\./g, ",");
};

watch(() => apiStore.revenue, () => {
  incrementData();
});

onMounted(() => {
  if (apiStore.customers && apiStore.customers.length > 0) {
    incrementData();
  }
});
</script>