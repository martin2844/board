/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('replies').del();
  await knex('threads').del();
  await knex('users').del();

  // Image URLs provided by user
  const imageUrls = [
    'https://s3.c5h.dev/threads/images/1748776470314_4gug1hr7v8c.webp',
    'https://s3.c5h.dev/threads/images/1748778215815_201yx7i6tfx.webp',
    'https://s3.c5h.dev/threads/images/1748778230152_dtjox9y7tg.webp',
    'https://s3.c5h.dev/threads/images/1748778343190_o6sej3e4yph.gif',
    'https://s3.c5h.dev/threads/images/1748779171619_x7uk8tkihj.gif',
    'https://s3.c5h.dev/threads/images/1748778692110_95sj23hawh8.webp',
    'https://s3.c5h.dev/threads/images/1748779194650_6iv6fg1npqr.webp',
    'https://s3.c5h.dev/threads/images/1748779318053_nven3mj8un.gif',
    'https://s3.c5h.dev/threads/images/1748779374590_h8rxtwazrd5.webp',
    'https://s3.c5h.dev/threads/images/1748779853886_3rtrz5ksxw4.webp',
    'https://s3.c5h.dev/threads/images/1748779860429_871dhww4jb7.webp',
    'https://s3.c5h.dev/threads/images/1748779866298_6azmgrq8v9i.gif'
  ];

  // Sample subjects for variety
  const subjects = [
    'Animation scenery wallpaper', 'Landscape Photography', 'Forest Vibes', 'Mountain Peaks', 
    'Cozy Places', 'Cyberpunk Aesthetics', 'Ocean Views', 'Desert Landscapes', 'City Lights',
    'Vintage Photography', 'Abstract Art', 'Nature Macros', 'Street Photography', 'Architecture',
    'Wildlife Photos', 'Food Photography', 'Travel Memories', 'Space Imagery', 'Minimalist Design',
    'Gaming Screenshots', 'Anime Backgrounds', 'Film Photography', 'Digital Art', 'Sunset Views',
    'Winter Scenes', 'Spring Flowers', 'Summer Vibes', 'Autumn Colors', 'Night Photography',
    'Urban Exploration', 'Historical Sites', 'Modern Art', 'Classic Cars', 'Technology',
    'Science Fiction', 'Fantasy Art', 'Horror Atmosphere', 'Romance Scenes', 'Action Shots'
  ];

  // Sample content templates with searchable keywords
  const contentTemplates = [
    'Post your favorite animated scenery wallpapers. The graphics quality is amazing these days.',
    'Share your best landscape shots. Nature photography never gets old.',
    'Deep forest photography thread. Looking for atmospheric pics with tortilla recipes.',
    'High altitude mountain photography. The view from 50 chars is always worth it.',
    'Cozy places you would snuggle with someone. Perfect for winter nights.',
    'Cyberpunk aesthetics and neon lights. Future city vibes are incredible.',
    'Ocean waves and beach photography. Nothing beats the sound of water.',
    'Desert landscapes with dramatic lighting. Sand dunes create amazing patterns.',
    'City lights at night create beautiful bokeh effects in photography.',
    'Vintage photography techniques using film cameras from the 1970s.',
    'Abstract art that challenges perception and makes you think differently.',
    'Nature macro photography revealing hidden details invisible to naked eye.',
    'Street photography capturing authentic moments of human interaction.',
    'Architecture photography showcasing modern and classical building designs.',
    'Wildlife photography requires patience but rewards with stunning images.',
    'Food photography making simple ingredients look absolutely delicious.',
    'Travel memories from around the world captured in single frames.',
    'Space imagery from telescopes showing galaxies millions of years away.',
    'Minimalist design principles applied to photography and visual arts.',
    'Gaming screenshots from latest releases with incredible graphics engines.'
  ];

  // Generate users (100 users for variety)
  const users = [];
  for (let i = 1; i <= 100; i++) {
    users.push({
      hash: `user_${i.toString().padStart(3, '0')}`,
      ip_address: `192.168.${Math.floor(i/256)}.${i%256}`,
      user_agent: `Mozilla/5.0 (Device ${i}) AppleWebKit/537.36`,
      device_id: `device_${i.toString().padStart(3, '0')}`
    });
  }
  await knex('users').insert(users);

  // Generate 1000 threads
  const threads = [];
  for (let i = 1; i <= 1000; i++) {
    const imageIndex = Math.floor(Math.random() * imageUrls.length);
    const subjectIndex = Math.floor(Math.random() * subjects.length);
    const contentIndex = Math.floor(Math.random() * contentTemplates.length);
    const userIndex = Math.floor(Math.random() * 100) + 1;
    
    // Random date within last 6 months
    const randomDate = new Date(Date.now() - Math.random() * 6 * 30 * 24 * 60 * 60 * 1000);
    
    // Get image details
    const imageUrl = imageUrls[imageIndex];
    const fileName = imageUrl.split('/').pop();
    const isGif = fileName.endsWith('.gif');
    
    threads.push({
      id: i,
      subject: subjects[subjectIndex] + (i > subjects.length ? ` #${Math.floor(i/subjects.length)}` : ''),
      content: contentTemplates[contentIndex] + ` Thread ${i} with unique content for testing search functionality.`,
      image_url: Math.random() > 0.3 ? imageUrl : null, // 70% chance of having image
      image_name: Math.random() > 0.3 ? fileName : null,
      image_size: Math.random() > 0.3 ? (Math.floor(Math.random() * 5000000) + 500000).toString() : null,
      image_dimensions: Math.random() > 0.3 ? (isGif ? '800x600' : `${1920 + Math.floor(Math.random() * 1080)}x${1080 + Math.floor(Math.random() * 720)}`) : null,
      user_hash: `user_${userIndex.toString().padStart(3, '0')}`,
      created_at: randomDate,
      updated_at: randomDate
    });
  }
  
  // Insert threads in batches of 100 to avoid SQLite limits
  const threadBatchSize = 100;
  for (let i = 0; i < threads.length; i += threadBatchSize) {
    const batch = threads.slice(i, i + threadBatchSize);
    await knex('threads').insert(batch);
    console.log(`Inserted threads batch ${Math.floor(i/threadBatchSize) + 1}/${Math.ceil(threads.length/threadBatchSize)}`);
  }

  // Generate 1000 replies
  const replies = [];
  const replyTexts = [
    'Very nice OP, but it would be better if these were labelled with proper tags.',
    'lmaooo this is exactly what I was looking for today.',
    'This is perfect! Thanks for sharing this amazing content.',
    'More like this please! The lighting and composition are incredible.',
    'Absolutely stunning work. How did you achieve this effect?',
    'Not bad, but I think the tortilla recipe needs more spice.',
    'The 50 chars limit makes it hard to express everything I want to say.',
    'Great photography skills! What camera and lens did you use?',
    'This reminds me of my childhood memories from summer vacations.',
    'Beautiful colors and contrast. Very professional looking shot.',
    'Thanks for posting this! Saved to my collection immediately.',
    'The atmospheric perspective in this image is just phenomenal.',
    'Incredible detail work. You can see every texture clearly.',
    'This would make an excellent desktop wallpaper for sure.',
    'Amazing composition following the rule of thirds perfectly.',
    'The depth of field creates such a dreamy bokeh effect.',
    'Natural lighting vs artificial - this is how its done right.',
    'Post processing skills are on point. What software do you use?',
    'This captures the mood and emotion perfectly in single frame.',
    'Technical excellence combined with artistic vision. Respect!'
  ];

  for (let i = 1; i <= 1000; i++) {
    const threadId = Math.floor(Math.random() * 1000) + 1;
    const replyIndex = Math.floor(Math.random() * replyTexts.length);
    const userIndex = Math.floor(Math.random() * 100) + 1;
    const imageIndex = Math.floor(Math.random() * imageUrls.length);
    
    // Random date after the thread creation
    const randomDate = new Date(Date.now() - Math.random() * 5 * 30 * 24 * 60 * 60 * 1000);
    
    const imageUrl = imageUrls[imageIndex];
    const fileName = imageUrl.split('/').pop();
    const isGif = fileName.endsWith('.gif');
    
    replies.push({
      id: i,
      thread_id: threadId,
      content: replyTexts[replyIndex] + ` Reply ${i} with searchable content.`,
      image_url: Math.random() > 0.7 ? imageUrl : null, // 30% chance of having image in reply
      image_name: Math.random() > 0.7 ? fileName : null,
      image_size: Math.random() > 0.7 ? (Math.floor(Math.random() * 3000000) + 200000).toString() : null,
      image_dimensions: Math.random() > 0.7 ? (isGif ? '640x480' : `${1280 + Math.floor(Math.random() * 640)}x${720 + Math.floor(Math.random() * 360)}`) : null,
      user_hash: `user_${userIndex.toString().padStart(3, '0')}`,
      created_at: randomDate,
      updated_at: randomDate
    });
  }
  
  // Insert replies in batches of 100 to avoid SQLite limits
  const replyBatchSize = 100;
  for (let i = 0; i < replies.length; i += replyBatchSize) {
    const batch = replies.slice(i, i + replyBatchSize);
    await knex('replies').insert(batch);
    console.log(`Inserted replies batch ${Math.floor(i/replyBatchSize) + 1}/${Math.ceil(replies.length/replyBatchSize)}`);
  }

  console.log('✅ Seeded database with 1000 threads and 1000 replies for FTS testing!');
}; 