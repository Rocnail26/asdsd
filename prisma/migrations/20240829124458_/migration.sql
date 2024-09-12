-- CreateTable
CREATE TABLE "Residence" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "owner_id" TEXT,
    "comunity_id" TEXT NOT NULL,
    "contacts" JSONB,
    "residenceType_id" INTEGER NOT NULL,

    CONSTRAINT "Residence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingSlot" (
    "id" TEXT NOT NULL,
    "number" BIGINT NOT NULL,
    "residence_id" TEXT NOT NULL,

    CONSTRAINT "ParkingSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResidenceType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ResidenceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "website" TEXT,
    "active" BOOLEAN NOT NULL,
    "comunity_id" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "UserName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "active" BOOLEAN NOT NULL,
    "comunity_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modules" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "residence_id" TEXT NOT NULL,
    "emitingDate" DATE NOT NULL,
    "expireDate" DATE NOT NULL,
    "status" TEXT NOT NULL,
    "expenseType_id" INTEGER NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "registerDate" DATE NOT NULL,
    "amount" DECIMAL(8,2) NOT NULL,
    "owner_id" TEXT NOT NULL,
    "expense_id" TEXT NOT NULL,
    "voucherImage" TEXT NOT NULL,
    "EmailSend" BOOLEAN NOT NULL,
    "account_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cashout" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "amount" DECIMAL(8,2) NOT NULL,
    "billImage" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "registerDate" DATE NOT NULL,

    CONSTRAINT "Cashout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "residenceType_id" INTEGER NOT NULL,

    CONSTRAINT "ExpenseType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Comunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "comunity_id" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Residence_owner_id_key" ON "Residence"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "Residence_comunity_id_key" ON "Residence"("comunity_id");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingSlot_residence_id_key" ON "ParkingSlot"("residence_id");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_user_id_key" ON "Owner"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_comunity_id_key" ON "Provider"("comunity_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_comunity_id_key" ON "User"("comunity_id");

-- CreateIndex
CREATE UNIQUE INDEX "Expense_residence_id_key" ON "Expense"("residence_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_owner_id_key" ON "Payment"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_expense_id_key" ON "Payment"("expense_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_account_id_key" ON "Payment"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_created_by_key" ON "Payment"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "Cashout_provider_id_key" ON "Cashout"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cashout_account_id_key" ON "Cashout"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_comunity_id_key" ON "Account"("comunity_id");

-- AddForeignKey
ALTER TABLE "Residence" ADD CONSTRAINT "Residence_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Residence" ADD CONSTRAINT "Residence_comunity_id_fkey" FOREIGN KEY ("comunity_id") REFERENCES "Comunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Residence" ADD CONSTRAINT "Residence_residenceType_id_fkey" FOREIGN KEY ("residenceType_id") REFERENCES "ResidenceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingSlot" ADD CONSTRAINT "ParkingSlot_residence_id_fkey" FOREIGN KEY ("residence_id") REFERENCES "Residence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_comunity_id_fkey" FOREIGN KEY ("comunity_id") REFERENCES "Comunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_comunity_id_fkey" FOREIGN KEY ("comunity_id") REFERENCES "Comunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_residence_id_fkey" FOREIGN KEY ("residence_id") REFERENCES "Residence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_expenseType_id_fkey" FOREIGN KEY ("expenseType_id") REFERENCES "ExpenseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashout" ADD CONSTRAINT "Cashout_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashout" ADD CONSTRAINT "Cashout_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseType" ADD CONSTRAINT "ExpenseType_residenceType_id_fkey" FOREIGN KEY ("residenceType_id") REFERENCES "ResidenceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_comunity_id_fkey" FOREIGN KEY ("comunity_id") REFERENCES "Comunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
