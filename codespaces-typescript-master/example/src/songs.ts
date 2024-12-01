export interface SongDetails {
    title: string;
    artist: string;
    duration: string;
    genre: string;
    releaseDate: string;
    streams: number;
}

export interface SongData {
    'Meta Data': {
        'Information': string;
        'Last Updated': string;
    };
    'Songs Collection': Record<string, SongDetails>;
}

export class SongAnalysis {
    private monthlyMax: Array<{song: string; streams: number}> = [];
    private loading = true;
    private error: string | null = null;
    private initialized: Promise<void>;

    constructor() {
        this.initialized = this.init();
    }

    private async fetchData(): Promise<SongData> {
        // Simulated API response
        return SongCollection;
    }

    private groupSongs(data: SongData) {
        const songData: { [key: string]: any[] } = {};
        Object.entries(data['Songs Collection']).forEach(([title, details]) => {
            const songKey = details.artist;
            if (!songData[songKey]) {
                songData[songKey] = [];
            }
            songData[songKey].push({
                title,
                streams: details.streams
            });
        });
        return songData;
    }

    private getTopSongs(songData: { [key: string]: any[] }) {
        const results: { song: string; streams: number }[] = [];
        Object.entries(songData).forEach(([artist, songs]) => {
            songs.forEach(song => {
                results.push({
                    song: `${song.title} - ${artist}`,
                    streams: song.streams
                });
            });
        });
        return results.sort((a, b) => b.streams - a.streams);
    }

    // ... rest of the methods remain similar
    
  private async init()
  {
    try
    {
      const rawData = await this.fetchData();
      if (!rawData) throw new Error('データが取得できませんでした');

      const groupedData = this.groupSongs(rawData);
      this.monthlyMax = this.getTopSongs(groupedData);
      this.loading = false;
    }
    catch (err)
    {
    // this.error = err.message;
      this.loading = false;
    }
  }

  async render()
  {
    await this.initialized;
    if (this.loading) return this.renderLoading();
    if (this.error) return this.renderError();
    return this.renderData();
  }

  private renderLoading()
  {
    return '<div>読み込み中...</div>';
  }

  private renderError()
  {
    return '<div>エラー: ${this.error}</div>';
  }

  private simplerenderData()
  {
    return `
        <div>
            <h2>月間最高終値</h2>
            <table>
            <thead>
                <tr>
                <th>月</th>
                <th>最高終値</th>
                </tr>
            </thead>
            <tbody>
                ${this.monthlyMax.map(({ song, streams }) => `
                <tr>
                    <td><a href="/monthly/${song}" style="color: #3498db; text-decoration: none;">
                                        ${song}
                                    </a></td>
                    <td>$${streams.toLocaleString()}</td>
                </tr>
                `).join('')}
            </tbody>
            </table>
        </div>
        `;
  }

  async getSongDetail(songTitle: string) {
    await this.initialized;
    try {
        const rawData = await this.fetchData();
        const songName = songTitle.split(' - ')[0];
        const songDetails = rawData['Songs Collection'][songName];

        return `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #333; text-align: center;">Song Details</h1>
                <a href="/" style="display: block; margin: 20px 0; color: #3498db; text-decoration: none;">← Back to Dashboard</a>
                
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                    <h2 style="color: #2c3e50;">${songDetails.title}</h2>
                    <p><strong>Artist:</strong> ${songDetails.artist}</p>
                    <p><strong>Duration:</strong> ${songDetails.duration}</p>
                    <p><strong>Genre:</strong> ${songDetails.genre}</p>
                    <p><strong>Release Date:</strong> ${songDetails.releaseDate}</p>
                    <p><strong>Total Streams:</strong> ${songDetails.streams.toLocaleString()}</p>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div>Error loading data for ${songTitle}: ${error}</div>`;
    }
  }

private renderData() {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #333; text-align: center;">Music Trending Dashboard</h1>
            
            <div style="max-width: 800px; margin: 0 auto;">
                <h2 style="color: #2c3e50; text-align: center;">Top Streaming Songs</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                    <thead>
                        <tr style="background-color: #2c3e50; color: white;">
                            <th style="padding: 12px; text-align: left;">Song</th>
                            <th style="padding: 12px; text-align: right;">Streams</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.monthlyMax.map(({ song, streams }) => `
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 12px;">
                                    <a href="/Monthly/${encodeURIComponent(song)}" style="color: #3498db; text-decoration: none;">
                                        ${song}
                                    </a>
                                </td>
                                <td style="padding: 12px; text-align: right;">
                                    ${streams.toLocaleString()}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
  }
}


export const SongCollection: SongData = {
    'Meta Data': {
        'Information': 'Monthly Song Statistics',
        'Last Updated': '2024-01-15'
    },
    'Songs Collection': {
        'Shape of You': {
            title: 'Shape of You',
            artist: 'Ed Sheeran',
            duration: '3:54',
            genre: 'Pop',
            releaseDate: '2024-01-06',
            streams: 2500000
        },
        'Blinding Lights': {
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            duration: '3:20',
            genre: 'Synth-pop',
            releaseDate: '2024-01-12',
            streams: 2200000
        },
        'Shining Blights': {
            title: 'Shining Blights',
            artist: 'The Beatles',
            duration: '4:20',
            genre: 'A-pop',
            releaseDate: '2024-03-12',
            streams: 250000
        }
    }
};
