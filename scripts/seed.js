import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const generateUser = () => ({
  id: faker.string.uuid(),
  full_name: faker.person.fullName(),
  role: faker.helpers.arrayElement(['student', 'instructor', 'admin']),
  status: faker.helpers.arrayElement(['pending', 'active', 'suspended']),
  created_at: faker.date.past(),
  updated_at: faker.date.recent()
});

const generateSignal = (userId) => {
  const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'TON/USDT', 'BNB/USDT'];
  const basePrices = {
    'BTC/USDT': 45000,
    'ETH/USDT': 3000,
    'SOL/USDT': 100,
    'TON/USDT': 2.5,
    'BNB/USDT': 350
  };

  const pair = faker.helpers.arrayElement(pairs);
  const basePrice = basePrices[pair];
  const type = faker.helpers.arrayElement(['LONG', 'SHORT']);
  const entryPrice = basePrice * (1 + faker.number.float({ min: -0.05, max: 0.05 }));
  
  return {
    id: faker.string.uuid(),
    user_id: userId,
    pair,
    type,
    entry_price: entryPrice,
    take_profit: type === 'LONG' ? 
      entryPrice * (1 + faker.number.float({ min: 0.05, max: 0.15 })) :
      entryPrice * (1 - faker.number.float({ min: 0.05, max: 0.15 })),
    stop_loss: type === 'LONG' ?
      entryPrice * (1 - faker.number.float({ min: 0.03, max: 0.08 })) :
      entryPrice * (1 + faker.number.float({ min: 0.03, max: 0.08 })),
    status: faker.helpers.arrayElement(['ACTIVE', 'COMPLETED', 'FAILED']),
    consensus: faker.number.int({ min: 60, max: 95 }),
    votes: faker.number.int({ min: 100, max: 5000 }),
    created_at: faker.date.recent(),
    description: faker.helpers.arrayElement([
      "Strong bullish momentum with increasing volume",
      "Key resistance level breakout confirmed",
      "Multiple technical indicators showing buy signals",
      "Bear trap formation with high volume",
      "Double bottom pattern completed"
    ])
  };
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // First disable RLS
    await supabase.rpc('disable_rls');

    // Generate users
    const users = Array.from({ length: 500 }, generateUser);
    console.log('Generated 500 users');

    // Insert users in batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('user_profiles')
        .insert(batch)
        .select();
      
      if (error) throw error;
      console.log(`Inserted users batch ${i/BATCH_SIZE + 1}`);
    }

    // Generate and insert signals
    const signals = [];
    for (let i = 0; i < 100; i++) {
      const randomUser = faker.helpers.arrayElement(users);
      signals.push(generateSignal(randomUser.id));
    }

    // Insert signals in batches
    for (let i = 0; i < signals.length; i += BATCH_SIZE) {
      const batch = signals.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('course_enrollments')
        .insert(batch.map(signal => ({
          user_id: signal.user_id,
          course_id: signal.id,
          status: signal.status === 'ACTIVE' ? 'enrolled' : 
                  signal.status === 'COMPLETED' ? 'completed' : 'dropped',
          progress: faker.number.int({ min: 0, max: 100 }),
          created_at: signal.created_at,
          updated_at: new Date()
        })));

      if (error) throw error;

      // Add signal metadata as permissions
      const { error: permError } = await supabase
        .from('course_permissions')
        .insert(batch.map(signal => ({
          course_id: signal.id,
          role: 'instructor',
          permissions: {
            pair: signal.pair,
            type: signal.type,
            entry_price: signal.entry_price,
            take_profit: signal.take_profit,
            stop_loss: signal.stop_loss,
            consensus: signal.consensus,
            votes: signal.votes,
            description: signal.description
          }
        })));

      if (permError) throw permError;
      console.log(`Inserted signals batch ${i/BATCH_SIZE + 1}`);
    }

    // Re-enable RLS
    await supabase.rpc('enable_rls');

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();