// Import Prisma Client to interact with the database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import crypto module to generate unique lottery numbers
const crypto = require("crypto");

/**
 * Subscribes a user to the lottery system with a specified plan type.
 * @param {string} userId - The ID of the user subscribing to the lottery.
 * @param {string} planType - The type of subscription (e.g., "basic", "premium").
 * @returns {Object} Response indicating success or failure.
 */
async function subscribeUser(userId, planType) {
  try {
    // Check if the user is already subscribed
    const existingSubscription = await prisma.lotterySubscription.findUnique({
      where: { userId },
    });

    if (existingSubscription) {
      return { success: false, message: "User is already subscribed" };
    }

    // Create a new subscription
    const subscription = await prisma.lotterySubscription.create({
      data: { userId, planType },
    });

    return {
      success: true,
      message: "User subscribed successfully",
      subscription,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Subscription failed", error };
  }
}

/**
 * Unsubscribes a user from the lottery system.
 * @param {string} userId - The ID of the user to unsubscribe.
 * @returns {Object} Response indicating success or failure.
 */
async function unsubscribeUser(userId) {
  try {
    // Check if the user is subscribed
    const existingSubscription = await prisma.lotterySubscription.findUnique({
      where: { userId },
    });

    if (!existingSubscription) {
      return { success: false, message: "User is not subscribed" };
    }

    // Delete subscription
    await prisma.lotterySubscription.delete({ where: { userId } });

    return { success: true, message: "User unsubscribed successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Unsubscription failed", error };
  }
}

/**
 * Generates a random 12-digit unique lottery number.
 * @returns {string} A unique 12-digit lottery number.
 */
function generateLotteryNumber() {
  return crypto.randomInt(100000000000, 999999999999).toString();
}

/**
 * Processes a lottery entry when a user makes a transaction.
 * @param {string} userId - The ID of the user making the transaction.
 * @param {string} transactionId - The ID of the transaction.
 * @param {number} amount - The transaction amount.
 * @returns {Object} Response indicating success or failure.
 */
async function processLotteryEntry(userId, transactionId, amount) {
  try {
    // Check if the user is subscribed
    const subscription = await prisma.lotterySubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return {
        success: false,
        message: "User is not subscribed to the lottery",
      };
    }

    // Determine ticket count based on subscription plan
    let ticketCount = subscription.planType === "premium" ? 3 : 1;

    // Generate unique lottery numbers
    const lotteryNumbers = Array.from(
      { length: ticketCount },
      generateLotteryNumber
    );

    // Save the transaction with lottery numbers
    const entry = await prisma.lotteryEntry.create({
      data: { userId, transactionId, lotteryNumbers },
    });

    return { success: true, message: "Lottery entry recorded", entry };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to process lottery entry",
      error,
    };
  }
}

/**
 * Selects a random lottery winner each week.
 * @returns {Object} Response indicating success or failure.
 */
async function selectWeeklyWinner() {
  try {
    // Retrieve all lottery entries
    const allEntries = await prisma.lotteryEntry.findMany();

    if (allEntries.length === 0) {
      return { success: false, message: "No entries available for selection" };
    }

    // Flatten all lottery numbers into a single array
    const allLotteryNumbers = allEntries.flatMap((entry) =>
      entry.lotteryNumbers.map((number) => ({ userId: entry.userId, number }))
    );

    // Select a random winner
    const winnerEntry =
      allLotteryNumbers[Math.floor(Math.random() * allLotteryNumbers.length)];

    // Store the winner in the winners table
    const winner = await prisma.winner.create({
      data: {
        userId: winnerEntry.userId,
        winningNumber: winnerEntry.number,
        createdAt: new Date(),
      },
    });

    return { success: true, message: "Winner selected successfully", winner };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to select a winner", error };
  }
}

/**
 * Clears all non-winning lottery data after a winner is selected.
 * @returns {Object} Response indicating success or failure.
 */
async function clearLotteryData() {
  try {
    // Retrieve the most recent winner
    const winner = await prisma.winner.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!winner) {
      return {
        success: false,
        message: "No winner found. Lottery data not cleared.",
      };
    }

    // Delete all non-winning lottery entries
    await prisma.lotteryEntry.deleteMany();

    return { success: true, message: "Non-winning lottery data cleared." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to clear lottery data", error };
  }
}

/**
 * Retrieves all lottery numbers for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Object} Response with user's lottery numbers or failure message.
 */
async function getUserLotteryEntries(userId) {
  try {
    // Fetch all lottery entries for the user
    const entries = await prisma.lotteryEntry.findMany({
      where: { userId },
      select: { lotteryNumbers: true, createdAt: true },
    });

    if (entries.length === 0) {
      return {
        success: false,
        message: "No lottery entries found for this user",
      };
    }

    return { success: true, entries };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to retrieve user lottery entries",
      error,
    };
  }
}

/**
 * Provides statistics on the lottery system.
 * @returns {Object} Response containing total participants, total tickets, and revenue.
 */
async function getLotteryStats() {
  try {
    // Count total unique participants
    const totalParticipants = await prisma.lotteryEntry.groupBy({
      by: ["userId"],
      _count: { userId: true },
    });

    // Count total tickets issued
    const totalTickets = await prisma.lotteryEntry.count();

    // Calculate revenue (assuming 1 Birr per ticket)
    const totalRevenue = totalTickets * 1;

    return {
      success: true,
      totalParticipants: totalParticipants.length,
      totalTickets,
      totalRevenue,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to retrieve lottery stats",
      error,
    };
  }
}

/**
 * Allows an admin to manually select a winner by specifying a lottery number.
 * @param {string} lotteryNumber - The lottery number of the winner.
 * @returns {Object} Response indicating success or failure.
 */
async function manuallySelectWinner(lotteryNumber) {
  try {
    // Find the entry that contains the specified lottery number
    const winningEntry = await prisma.lotteryEntry.findFirst({
      where: { lotteryNumbers: { has: lotteryNumber } },
    });

    if (!winningEntry) {
      return { success: false, message: "Lottery number not found" };
    }

    // Store the winner
    const winner = await prisma.winner.create({
      data: {
        userId: winningEntry.userId,
        winningNumber: lotteryNumber,
        createdAt: new Date(),
      },
    });

    return { success: true, message: "Winner manually selected", winner };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to manually select winner",
      error,
    };
  }
}
