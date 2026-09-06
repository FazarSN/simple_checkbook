package com.simplecheckbook.app;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import androidx.annotation.NonNull;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "NativeDatabase")
public class NativeDatabasePlugin extends Plugin {
    private static final String DATABASE_NAME = "simple_checkbook.db";
    private static final int DATABASE_VERSION = 1;

    private static class DatabaseHelper extends SQLiteOpenHelper {
        DatabaseHelper(android.content.Context context) {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
        }

        @Override
        public void onCreate(@NonNull SQLiteDatabase database) {
            database.execSQL("CREATE TABLE transactions (id INTEGER PRIMARY KEY, type TEXT NOT NULL, amount REAL NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, account TEXT NOT NULL, date TEXT NOT NULL)");
            database.execSQL("CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
            database.execSQL("INSERT INTO metadata (key, value) VALUES ('next_id', '1')");
            database.execSQL("INSERT INTO metadata (key, value) VALUES ('schema_version', '1')");
        }

        @Override
        public void onUpgrade(@NonNull SQLiteDatabase database, int oldVersion, int newVersion) {
        }
    }

    @PluginMethod
    public void load(PluginCall call) {
        DatabaseHelper helper = new DatabaseHelper(getContext());
        SQLiteDatabase database = helper.getReadableDatabase();
        JSArray transactions = new JSArray();
        Cursor cursor = database.rawQuery("SELECT id, type, amount, name, category, account, date FROM transactions ORDER BY id", null);
        int nextId;
        try {
            while (cursor.moveToNext()) {
                JSObject transaction = new JSObject();
                transaction.put("id", cursor.getInt(0));
                transaction.put("type", cursor.getString(1));
                transaction.put("amount", cursor.getDouble(2));
                transaction.put("name", cursor.getString(3));
                transaction.put("category", cursor.getString(4));
                transaction.put("account", cursor.getString(5));
                transaction.put("date", cursor.getString(6));
                transactions.put(transaction);
            }
            nextId = readNextId(database);
        } finally {
            cursor.close();
            database.close();
            helper.close();
        }

        JSObject result = new JSObject();
        result.put("transactions", transactions);
        result.put("nextId", nextId);
        call.resolve(result);
    }

    @PluginMethod
    public void saveAll(PluginCall call) {
        JSArray transactions = call.getArray("transactions", new JSArray());
        int nextId = call.getInt("nextId", 1);
        DatabaseHelper helper = new DatabaseHelper(getContext());
        SQLiteDatabase database = helper.getWritableDatabase();
        database.beginTransaction();
        try {
            database.delete("transactions", null, null);
            for (int index = 0; index < transactions.length(); index++) {
                JSONObject transaction = transactions.getJSONObject(index);
                android.content.ContentValues values = new android.content.ContentValues();
                values.put("id", transaction.getInt("id"));
                values.put("type", transaction.getString("type"));
                values.put("amount", transaction.getDouble("amount"));
                values.put("name", transaction.getString("name"));
                values.put("category", transaction.getString("category"));
                values.put("account", transaction.getString("account"));
                values.put("date", transaction.getString("date"));
                database.insertOrThrow("transactions", null, values);
            }
            android.content.ContentValues metadata = new android.content.ContentValues();
            metadata.put("value", Integer.toString(nextId));
            database.update("metadata", metadata, "key = ?", new String[]{"next_id"});
            database.setTransactionSuccessful();
        } catch (JSONException exception) {
            call.reject("Invalid transaction data", exception);
            return;
        } finally {
            database.endTransaction();
            database.close();
            helper.close();
        }
        call.resolve();
    }

    private int readNextId(SQLiteDatabase database) {
        Cursor cursor = database.rawQuery("SELECT value FROM metadata WHERE key = 'next_id'", null);
        try {
            if (cursor.moveToFirst()) {
                return Integer.parseInt(cursor.getString(0));
            }
            return 1;
        } finally {
            cursor.close();
        }
    }
}
