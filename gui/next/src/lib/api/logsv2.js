/*
  handles downloading logs from API
*/



const logs = {

  // purpose:		downloads logs from API
  // arguments:
  // returns:		logs in json format
  // ------------------------------------------------------------------------
  get: async (filters = {}) => {
    // the URL to use to connect to the API, in development or preview mode we are using the default pos-cli gui serve port
    const url = (typeof window !== 'undefined' && window.location.port !== '4173' && window.location.port !== '5173') ? `http://localhost:${parseInt(window.location.port)}/api/logsv2` : 'http://localhost:3333/api/logsv2';

    filters.page = filters.page ? parseInt(filters.page) - 1 : 0;
    filters.size = filters.size ?? 20;
    filters.from = filters.page * filters.size ?? 0;
    filters.stream_name = filters.stream_name ?? 'logs'

    // parse the dates from YYYY-MM-DD
    if(filters.start_time){
      // we need end-of-day
      let date = new Date(filters.start_time);
      date.setHours(23, 59, 59);

      filters.end_time = Math.floor(date.getTime() * 1000);
      filters.start_time = Math.floor(date.getTime() - 24 * 60 * 60 * 1000 * 3);
    }

    if(filters.message){
      filters.sql = `SELECT * FROM logs where message ILIKE '%${filters.message}%' OR type ILIKE '%${filters.message}%' OR options_data_url ILIKE '%${filters.message}%'`;
    }

    const request = {
      query: {
        sql: filters.sql || `SELECT * FROM ${filters.stream_name}`,
        from: filters.from,
        size: filters.size,
        start_time: filters.start_time || 0,
        end_time: filters.end_time || 0,
        track_total_hits: true
      }
    }

    return fetch(`${url}`, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(response => {
        if(response.ok){
          return response.json();
        }

        return Promise.reject(response);
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        return { error: error };
      });

  }

};



// exports
// ------------------------------------------------------------------------
export { logs };
