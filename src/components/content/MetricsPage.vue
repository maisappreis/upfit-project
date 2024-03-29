<template>
    <div class="content-area">
        <RevenueExpensesChart
            :monthlyRevenue="monthlyRevenueOrdered"
            :monthlyExpenses="monthlyExpensesOrdered"
        />
        <div style="display: flex">
            <ActiveCustomersChart :customers="customers" :revenue="revenue" />
            <ProfitChart :monthlyProfit="monthlyProfit" />
        </div>
    </div>
</template>

<script>
import RevenueExpensesChart from "../charts/RevenueExpensesChart.vue";
import ActiveCustomersChart from "../charts/ActiveCustomersChart.vue";
import ProfitChart from "../charts/ProfitChart.vue";

export default {
    name: "MetricsPage",

    components: {
        RevenueExpensesChart,
        ActiveCustomersChart,
        ProfitChart,
    },

    props: {
        customers: Array,
        revenue: Array,
        expenses: Array,
    },

    data() {
        return {
            monthlyRevenueOrdered: [],
            monthlyExpensesOrdered: [],
            monthlyProfit: [],
        };
    },

    methods: {
        sumMonthlyAmounts(data) {
            const summedValuesMap = new Map();

            data.forEach((item) => {
                const key = `${item.year}-${item.month}`;

                if (!summedValuesMap.has(key)) {
                    summedValuesMap.set(key, {
                        year: item.year,
                        month: item.month,
                        sum: 0,
                    });
                }
                summedValuesMap.get(key).sum += item.value;
            });
            return Array.from(summedValuesMap.values());
        },

        calculateProfit() {
            const resultArray = [];

            this.monthlyRevenueOrdered.forEach((revenueItem) => {
                const expenseItem = this.monthlyExpensesOrdered.find(
                    (expense) =>
                        expense.year === revenueItem.year &&
                        expense.month === revenueItem.month
                );

                const profit = {
                    year: revenueItem.year,
                    month: revenueItem.month,
                    sum: revenueItem.sum - (expenseItem ? expenseItem.sum : 0),
                };

                resultArray.push(profit);
            });

            this.monthlyProfit = resultArray;
        },
    },

    watch: {
        revenue() {
            if (this.revenue && this.revenue.length > 0) {
                let paidRevenue = this.revenue.filter((e) => e.paid === "Pago");
                let paidExpenses = this.expenses.filter(
                    (e) => e.paid === "Pago"
                );

                let monthlyRevenue = this.sumMonthlyAmounts(paidRevenue);
                let monthlyExpenses = this.sumMonthlyAmounts(paidExpenses);

                this.monthlyRevenueOrdered =
                    this.$methods.sortData(monthlyRevenue);
                this.monthlyExpensesOrdered =
                    this.$methods.sortData(monthlyExpenses);

                this.calculateProfit();
            }
        },
    },

    mounted() {
        this.$emit("updateData");
    },
};
</script>

<style scoped>
</style>