<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mood_trackers', function (Blueprint $table) {
            $table->id();
            $table->string('mood'); // Mood type (e.g., happy, sad, anxious)
            $table->text('note')->nullable(); // Optional description of the mood
            $table->date('tracked_at')->default(now()); // Date of the mood entry
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mood_trackers');
    }
};
