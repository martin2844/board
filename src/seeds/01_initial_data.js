/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('replies').del();
  await knex('threads').del();
  await knex('users').del();

  // Insert users first
  const users = [
    {
      hash: 'user_001',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      device_id: 'device_001'
    },
    {
      hash: 'user_002', 
      ip_address: '192.168.1.101',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      device_id: 'device_002'
    },
    {
      hash: 'user_003',
      ip_address: '192.168.1.102', 
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      device_id: 'device_003'
    }
  ];

  await knex('users').insert(users);

  // Insert threads
  const threads = [
    {
      id: 1,
      subject: "Animation scenery wallpaper",
      content: "Post your favorite animated scenery wallpapers. I'll start with this beautiful castle scene.",
      image_url: "/placeholder.svg?height=300&width=400",
      image_name: "Cliffside-Tower.png",
      image_size: "2190000",
      image_dimensions: "1920x1080",
      user_hash: "user_001",
      created_at: new Date("2025-05-15T18:10:22"),
      updated_at: new Date("2025-05-15T18:10:22")
    },
    {
      id: 2,
      subject: "Landscape Photography",
      content: "Share your best landscape shots. Nature is beautiful.",
      image_url: "/placeholder.svg?height=250&width=350",
      image_name: "17316266990710.jpg",
      image_size: "2060000",
      image_dimensions: "3840x2160",
      user_hash: "user_002",
      created_at: new Date("2025-05-16T14:38:11"),
      updated_at: new Date("2025-05-16T14:38:11")
    },
    {
      id: 3,
      subject: "Forest Vibes",
      content: "Deep forest photography thread. Post your most atmospheric forest pics.",
      image_url: "/placeholder.svg?height=250&width=350",
      image_name: "17275138403119.jpg",
      image_size: "652000",
      image_dimensions: "1920x1080",
      user_hash: "user_001",
      created_at: new Date("2025-05-16T14:39:57"),
      updated_at: new Date("2025-05-16T14:39:57")
    },
    {
      id: 4,
      subject: "Mountain Peaks",
      content: "High altitude photography. The view from the top is always worth it.",
      image_url: "/placeholder.svg?height=250&width=350",
      image_name: "16354654654.jpg",
      image_size: "664000",
      image_dimensions: "4096x1743",
      user_hash: "user_003",
      created_at: new Date("2025-05-16T17:35:16"),
      updated_at: new Date("2025-05-16T17:35:16")
    },
    {
      id: 5,
      subject: "Cozy Places",
      content: `Cozy places you would snuggle with someone you love
>cool/darker colors
>comfy/peaceful setting
>sense of privacy
>nothing else besides you matters in the world`,
      image_url: "/placeholder.svg?height=250&width=350",
      image_name: "heidi_-_girl_of_the_alps_(...).png",
      image_size: "4090000",
      image_dimensions: "2880x2160",
      user_hash: "user_002",
      created_at: new Date("2025-05-25T18:51:56"),
      updated_at: new Date("2025-05-25T18:51:56")
    },
    {
      id: 6,
      subject: "Cyberpunk Aesthetics",
      content: `Cozy places you would snuggle with someone you love
>cool/darker colors
>comfy/peaceful setting  
>sense of privacy
>nothing else besides you matters in the world`,
      image_url: "/placeholder.svg?height=250&width=350",
      image_name: "cozy.png",
      image_size: "3000000",
      image_dimensions: "2194x1226",
      user_hash: "user_003",
      created_at: new Date("2025-01-01T02:56:17"),
      updated_at: new Date("2025-01-01T02:56:17")
    }
  ];

  await knex('threads').insert(threads);

  // Insert replies
  const replies = [
    {
      id: 8103406,
      thread_id: 8103257,
      content: "Very nice OP, but it would be better if these were labelled.",
      image_url: "/placeholder.svg?height=200&width=300",
      image_name: "the_port_of_hort.jpg",
      image_size: "442000",
      image_dimensions: "1920x1038",
      user_hash: "user_002",
      created_at: new Date("2025-05-16T05:54:08"),
      updated_at: new Date("2025-05-16T05:54:08")
    },
    {
      id: 8104550,
      thread_id: 8104549,
      content: ">>8101327\nlmaooo",
      user_hash: "user_001",
      created_at: new Date("2025-05-25T21:18:00"),
      updated_at: new Date("2025-05-25T21:18:00")
    },
    {
      id: 8092301,
      thread_id: 8092299,
      content: "This is exactly what I needed today. Thanks OP.",
      user_hash: "user_002",
      created_at: new Date("2025-01-01T03:15:22"),
      updated_at: new Date("2025-01-01T03:15:22")
    },
    {
      id: 8092305,
      thread_id: 8092299,
      content: "More like this please! The lighting is perfect.",
      user_hash: "user_003",
      created_at: new Date("2025-01-01T03:45:11"),
      updated_at: new Date("2025-01-01T03:45:11")
    }
  ];

  await knex('replies').insert(replies);
}; 