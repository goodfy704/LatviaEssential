import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel, EmbedBuilder } from 'discord.js';

@Injectable()
export class DiscordService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private ready = false;

  async onModuleInit(): Promise<void> {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
    this.client.on('ready', () => {
      this.ready = true;
    });
    await this.client.login(process.env.DISCORD_BOT_TOKEN);
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
    if (!channelId) return;

    const embed = new EmbedBuilder()
      .setTitle('🚀 New Job Found')
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
