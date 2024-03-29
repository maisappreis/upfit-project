<template>
    <div class="content-area">
        <div style="display: flex; justify-content: space-between">
            <DefaultButton
                @executeAction="addCustomer"
                style="background-color: var(--red-dark-color)"
            >
                <font-awesome-icon icon="fa-solid fa-plus" class="icon-add" />
                Novo Cliente
            </DefaultButton>
            <div style="display: flex; justify-content: flex-end">
                <StatusFilter @get-status="getStatus" />
                <DefaultSearch @applySearch="applySearch" />
            </div>
        </div>
        <DefaultTable
            :columns="columns"
            :data="filteredCustomers"
            :searchedField="searchedField"
            :requestMessage="requestMessage"
            @updateItem="updateCustomer"
            @deleteItem="showDeleteModal"
        />
        <DefaultModal v-if="showModal"
            :isForm="isForm"
            :buttonMessage="buttonMessage"
            @executeAction="getModalAction"
            @closeModal="closeModal"
        >
            <h3 v-if="action === 'delete' && blockDelete" class="message-area">
                Não é possível excluir o cliente <strong class="highlight">{{ customerName }}</strong>,
                pois isso excluiria todo o seu histórico de receitas. Ao invés de excluí-lo, mude seu
                status para <strong class="highlight">Inativo</strong>.
            </h3>
            <h3 v-else-if="action === 'delete' && !blockDelete" class="message-area">
                Tem certeza que deseja excluir o cliente <strong class="highlight">{{ customerName }}</strong>?
            </h3>
            <CustomersForm
                v-else
                :item="item"
                :action="action"
                :modalTitle="modalTitle"
                @updateTable="$emit('updateData')"
                @closeModal="closeModal"
                @showMessage="showMessage"
            />
        </DefaultModal>
        <div v-if="showModal" class="defocus"></div>
    </div>
</template>

<script>
import DefaultTable from "../common/DefaultTable.vue";
import DefaultButton from "../common/DefaultButton.vue";
import DefaultSearch from "../common/DefaultSearch.vue";
import DefaultModal from "../common/DefaultModal.vue";
import CustomersForm from "../forms/CustomersForm.vue";
import StatusFilter from "../common/StatusFilter.vue";
import { globalVariablesMixin } from "@/utils/variables.js";
import axios from "axios";

export default {
    name: "CustomersPage",
    mixins: [globalVariablesMixin],

    components: {
        DefaultTable,
        DefaultButton,
        DefaultSearch,
        DefaultModal,
        CustomersForm,
        StatusFilter,
    },

    props: {
        customers: Array,
        revenue: Array,
    },

    data() {
        return {
            columns: [
                { key: "name", name: "Nome" },
                { key: "frequency", name: "Freq." },
                { key: "start", name: "Data de início" },
                { key: "plan", name: "Plano" },
                { key: "value", name: "Valor" },
                { key: "status", name: "Status" },
                { key: "actions", name: "" },
            ],
            searchedField: [],
            showModal: false,
            item: {},
            action: "",
            customerName: "",
            modalTitle: "",
            requestMessage: "",
            currentStatus: "",
            buttonMessage: "Confirmar",
            isForm: false,
        };
    },

    computed: {
        filteredCustomers() {
            if (this.customers && this.customers.length > 0) {
                if (this.currentStatus === "Todos") {
                    return this.customers;
                } else {
                    return this.customers.filter(
                        (e) => e.status === this.currentStatus
                    );
                }
            } else {
                return [];
            }
        },
    },

    methods: {
        applySearch(field) {
            this.searchedField = field;
        },

        addCustomer() {
            this.showModal = true;
            this.isForm = true;
            this.action = "create";
            this.modalTitle = "Adicionar Cliente";
        },

        updateCustomer(item) {
            this.showModal = true;
            this.isForm = true;
            this.item = item;
            this.action = "update";
            this.modalTitle = "Atualizar Cliente";
        },

        getModalAction() {
            if (this.blockDelete) {
                this.inactiveCustomer();
            } else {
                this.deleteCustomer();
            }
        },

        async deleteCustomer() {
            try {
                await axios.delete(`${this.apiURL}/customer/${this.item.id}/`);
                this.showMessage("Cliente excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir cliente.", error);

                this.showMessage("Erro ao excluir cliente.");
            }

            this.showModal = false;
            this.$emit("updateData");
        },

        async inactiveCustomer() {
            try {
                let data = { status: "Inativo" };

                await axios.patch(
                    `${this.apiURL}/customer/${this.item.id}/`,
                    data
                );
                this.showMessage("Cliente inativado com sucesso!");
            } catch (error) {
                console.error("Erro ao inativar cliente.", error);

                this.showMessage("Erro ao inativar cliente.");
            }

            this.showModal = false;
            this.$emit("updateData");
        },

        showDeleteModal(item) {
            this.item = item;
            this.showModal = true;
            this.action = "delete";
            let revenueHistory = this.revenue.filter(
                (e) => e.customer === this.item.id
            );

            this.customerName = item.name;

            if (revenueHistory.length > 0) {
                this.blockDelete = true;
                this.buttonMessage = "Inativar cliente";
            } else {
                this.blockDelete = false;
            }
        },

        closeModal() {
            this.showModal = false;
            this.isForm = false;
            this.buttonMessage = "Confirmar";
        },

        showMessage(msg) {
            this.requestMessage = msg;
        },

        getStatus(status) {
            this.currentStatus = status;
        },
    },
};
</script>

<style scoped>
</style>