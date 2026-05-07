import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel, EmbedBuilder } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  async onModuleInit(): Promise<void> {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) return;

    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
    await this.client.login(token);
  }

  async onModuleDestroy(): Promise<void> {
    this.client?.destroy();
  }

  async sendJobNotification(job: {
    title: string;
    company: string | null;
    location: string | null;
    url: string;
  }): Promise<void> {
    const channelId = process.env.DISCORD_CHANNEL_ID;
    if (!channelId || !this.client) return;

    const embed = new EmbedBuilder()
      .setTitle('New Job Found')
      .setColor(0x00ae86)
      .addFields(
        { name: 'Title', value: job.title, inline: false },
        { name: 'Company', value: job.company ?? 'N/A', inline: true },
        { name: 'Location', value: job.location ?? 'N/A', inline: true },
      )
      .setURL(job.url)
      .setTimestamp();

    const channel = this.client.channels.cache.get(channelId) as TextChannel;
    if (channel) {
      await channel.send({ embeds: [embed] });
    }
  }
}
