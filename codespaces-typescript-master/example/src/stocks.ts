import { StockData } from './types';

export class  StockAnalysis {
  private monthlyMax: Array<{month: string; maxClose: number}> = [];
  private loading = true;
  private error: string | null = null;
  private initialized: Promise<void>;

  constructor() {
    this.initialized = this.init();
  }

  private async fetchData(): Promise<StockData> {

    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo';

    const response = await fetch(url);
    const data: StockData = await response.json();
    return data;
  }

  private groupMonth(data: StockData) {
    const monthlyData: { [key: string]: any[] } = {};

    Object.entries(data['Time Series (Daily)']).forEach(([date, values]) => {
      const monthKey = date.substring(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = [];
      }
      monthlyData[monthKey].push({
        date,
        close: parseFloat(values['4. close'])
      });
    });
    return monthlyData;
  }

  private getMax(monthlyData: { [key: string]: any[] }) {
    const results: { month: string; maxClose: number }[] = [];

    Object.entries(monthlyData).forEach(([month, data]) => {
      if (data.length) {
        const maxClose = Math.max(...data.map(item => item.close));
        results.push({ month, maxClose });
      }
    });
    return results;
  }

  private async init()
  {
    try
    {
      const rawData = await this.fetchData();
      if (!rawData) throw new Error('データが取得できませんでした');

      const groupedData = this.groupMonth(rawData);
      this.monthlyMax = this.getMax(groupedData);
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
                ${this.monthlyMax.map(({ month, maxClose }) => `
                <tr>
                    <td><a href="/monthly/${month}" style="color: #3498db; text-decoration: none;">
                                        ${month}
                                    </a></td>
                    <td>$${maxClose.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
            </table>
        </div>
        `;
  }

  async getMonthlyDetail(targetMonth: string) {
    await this.initialized; // Wait for data to be loaded

    try {
        const rawData = await this.fetchData();
        const dailyData = Object.entries(rawData['Time Series (Daily)'])
            .filter(([date]) => date.startsWith(targetMonth))
            .map(([date, values]) => ({
                date,
                open: parseFloat(values['1. open']),
                high: parseFloat(values['2. high']),
                low: parseFloat(values['3. low']),
                close: parseFloat(values['4. close']),
                volume: parseInt(values['5. volume'])
            }));

        return `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #333; text-align: center;">Daily Trading Data for ${targetMonth}</h1>
                <a href="/" style="display: block; margin: 20px 0; color: #3498db; text-decoration: none;">← Back to Overview</a>
                
                <div style="max-width: 1000px; margin: 0 auto;">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                        <thead>
                            <tr style="background-color: #2c3e50; color: white;">
                                <th style="padding: 12px;">Date</th>
                                <th style="padding: 12px;">Open</th>
                                <th style="padding: 12px;">High</th>
                                <th style="padding: 12px;">Low</th>
                                <th style="padding: 12px;">Close</th>
                                <th style="padding: 12px;">Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dailyData.map(day => `
                                <tr style="border-bottom: 1px solid #ddd;">
                                    <td style="padding: 12px;">${day.date}</td>
                                    <td style="padding: 12px;">$${day.open.toFixed(2)}</td>
                                    <td style="padding: 12px;">$${day.high.toFixed(2)}</td>
                                    <td style="padding: 12px;">$${day.low.toFixed(2)}</td>
                                    <td style="padding: 12px;">$${day.close.toFixed(2)}</td>
                                    <td style="padding: 12px;">${day.volume.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div>Error loading data for ${targetMonth}: ${error}</div>`;
    }
　}

  private renderData() {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Stock Analysis Dashboard</h1>
          
          <div style="max-width: 800px; margin: 0 auto;">
              <h2 style="color: #2c3e50; text-align: center;">Monthly Maximum Closing Prices</h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                  <thead>
                      <tr style="background-color: #2c3e50; color: white;">
                          <th style="padding: 12px; text-align: left;">Month</th>
                          <th style="padding: 12px; text-align: right;">Highest Closing Price</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${this.monthlyMax.map(({ month, maxClose }) => `
                          <tr style="border-bottom: 1px solid #ddd;">
                              <td style="padding: 12px;">
                                  <a href="/monthly/${month}" style="color: #3498db; text-decoration: none;">
                                      ${month}
                                  </a>
                              </td>
                              <td style="padding: 12px; text-align: right;">
                                  $${maxClose.toFixed(2)}
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

// const analy = new StockAnalysis();
// // console.log(analy.render());

// (async() => {
//   const rendered = await analy.render();
//   console.log('Rendered:', rendered);
// })();
