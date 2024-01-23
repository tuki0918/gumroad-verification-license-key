-- CreateEnum
CREATE TYPE "RedeemLicenseStatus" AS ENUM ('enable', 'disabled');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('alive', 'pending_cancellation', 'pending_failure', 'failed_payment', 'fixed_subscription_period_ended', 'cancelled');

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "order_number" TEXT NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_permalink" TEXT NOT NULL,
    "variants" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "recurrence" TEXT NOT NULL,
    "refunded" BOOLEAN NOT NULL DEFAULT false,
    "subscription_id" TEXT,
    "subscription_ended_at" TIMESTAMP(3),
    "subscription_cancelled_at" TIMESTAMP(3),
    "subscription_failed_at" TIMESTAMP(3),

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedeemLicense" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_permalink" TEXT NOT NULL,
    "variants" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "recurrence" TEXT NOT NULL,
    "status" "RedeemLicenseStatus" NOT NULL DEFAULT 'enable',
    "discord_id" TEXT NOT NULL,
    "discord_grant_roles" TEXT[],
    "subscription_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RedeemLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "recurrence" TEXT NOT NULL,
    "license_key" VARCHAR(255) NOT NULL,
    "charge_occurrence_count" INTEGER,
    "cancelled_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "free_trial_ends_at" TIMESTAMP(3),
    "user_requested_cancellation_at" TIMESTAMP(3),
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'alive',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RedeemLicense_code_discord_id_key" ON "RedeemLicense"("code", "discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscription_id_key" ON "Subscription"("subscription_id");

-- AddForeignKey
ALTER TABLE "RedeemLicense" ADD CONSTRAINT "RedeemLicense_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("subscription_id") ON DELETE SET NULL ON UPDATE CASCADE;
