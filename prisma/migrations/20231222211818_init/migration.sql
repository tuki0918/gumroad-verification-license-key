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
    "subscription_ended_at" TIMESTAMP(3),
    "subscription_cancelled_at" TIMESTAMP(3),
    "subscription_failed_at" TIMESTAMP(3),

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);
