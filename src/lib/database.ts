export interface Database {
    public: {
      Tables: {
        orders: {
          Row: {
            id: string;
            created_at: string;
            name: string;
            user_id: string;
          } // The data expected to be returned from a "select" statement.
          Insert: {
            name: string;
            user_id: string;
          } // The data expected passed to an "insert" statement.
          Update: {
            name: string;
            user_id: string;
          } // The data expected passed to an "update" statement.
        }
      }
    }
  }