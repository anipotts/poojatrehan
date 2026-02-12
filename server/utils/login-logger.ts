interface LoginAttempt {
  ip: string;
  timestamp: Date;
  magicWord: string;
  success: boolean;
}

const attempts: LoginAttempt[] = [];
const MAX_STORED_ATTEMPTS = 1000; // Prevent unlimited memory growth

export function logLoginAttempt(ip: string, word: string, success: boolean) {
  // Hash the magic word for privacy (in production, consider using a proper hash)
  const hashedWord = word.length > 2
    ? word.substring(0, 2) + '*'.repeat(word.length - 2)
    : '***';

  const attempt: LoginAttempt = {
    ip,
    timestamp: new Date(),
    magicWord: hashedWord,
    success,
  };

  attempts.push(attempt);

  // Keep only recent attempts
  if (attempts.length > MAX_STORED_ATTEMPTS) {
    attempts.shift();
  }

  // Log to console
  console.log(
    `[LOGIN ${success ? 'SUCCESS' : 'FAILED'}] IP: ${ip} | Time: ${attempt.timestamp.toISOString()} | Word: ${hashedWord}`
  );
}

export function getRecentAttempts(limit: number = 100): LoginAttempt[] {
  return attempts.slice(-limit);
}
